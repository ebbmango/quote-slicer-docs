import fs from 'node:fs';
import path from 'node:path';

const virtualModuleId = 'virtual:article-toc';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
const routePageSuffix = '/+page.svx';

/**
 * @typedef {import('../navigation/tocTypes').TocHeading} TocHeading
 * @typedef {import('../navigation/tocTypes').TocTree} TocTree
 * @typedef {import('../navigation/tocTypes').TocByRoute} TocByRoute
 */

/**
 * Converts visible heading text into a stable URL fragment.
 *
 * The algorithm is intentionally shared by the ToC extractor and the rehype
 * heading-id plugin so generated links keep matching rendered headings.
 *
 * @param {string} title
 */
export function slugHeading(title) {
	const slug = title
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

	return slug || 'section';
}

export function createHeadingSlugger() {
	/** @type {Map<string, number>} */
	const seen = new Map();

	/**
	 * @param {string} title
	 */
	return function uniqueSlug(title) {
		const base = slugHeading(title);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);

		return count === 0 ? base : `${base}-${count}`;
	};
}

/**
 * @param {string} source
 * @param {{ minLevel?: number; maxLevel?: number }} [options]
 * @returns {TocTree}
 */
export function extractTocFromSvx(source, { minLevel = 2, maxLevel = 4 } = {}) {
	const headings = extractFlatHeadings(source, { minLevel, maxLevel });

	return buildTocTree(headings);
}

/**
 * @param {string} source
 * @param {{ minLevel: number; maxLevel: number }} options
 * @returns {TocTree}
 */
function extractFlatHeadings(source, { minLevel, maxLevel }) {
	const slug = createHeadingSlugger();
	const headings = [];
	const lines = source.split(/\r?\n/);
	let inFrontmatter = lines[0]?.trim() === '---';
	let inFence = false;
	let fenceMarker = '';
	let inHtmlComment = false;
	let inSvelteBlock = false;
	let svelteBlockTag = '';
	let position = 0;

	for (let i = inFrontmatter ? 1 : 0; i < lines.length; i += 1) {
		const line = lines[i];
		const trimmed = line.trim();

		if (inFrontmatter) {
			if (trimmed === '---') inFrontmatter = false;
			continue;
		}

		if (inHtmlComment) {
			if (trimmed.includes('-->')) inHtmlComment = false;
			continue;
		}

		if (trimmed.startsWith('<!--')) {
			if (!trimmed.includes('-->')) inHtmlComment = true;
			continue;
		}

		if (inSvelteBlock) {
			if (trimmed.toLowerCase().includes(`</${svelteBlockTag}>`)) {
				inSvelteBlock = false;
				svelteBlockTag = '';
			}
			continue;
		}

		const blockStart = trimmed.match(/^<(script|style)(\s|>|$)/i);
		if (blockStart) {
			const tag = blockStart[1].toLowerCase();
			if (!trimmed.toLowerCase().includes(`</${tag}>`)) {
				inSvelteBlock = true;
				svelteBlockTag = tag;
			}
			continue;
		}

		const fenceStart = trimmed.match(/^(```+|~~~+)/);
		if (fenceStart) {
			if (
				inFence &&
				fenceStart[1][0] === fenceMarker[0] &&
				fenceStart[1].length >= fenceMarker.length
			) {
				inFence = false;
				fenceMarker = '';
			} else if (!inFence) {
				inFence = true;
				fenceMarker = fenceStart[1];
			}
			continue;
		}

		if (inFence) continue;

		const match = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
		if (!match) continue;

		const level = match[1].length;
		if (level < minLevel || level > maxLevel) continue;

		const title = markdownHeadingToText(match[2]);
		if (!title) continue;

		headings.push({
			title,
			id: slug(title),
			level,
			position,
			children: []
		});

		position += 1;
	}

	return headings;
}

/**
 * @param {string} heading
 */
function markdownHeadingToText(heading) {
	return heading
		.replace(/\s+\{#[^}]+\}\s*$/, '')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\[\[([^\]|#]+#[^\]|]+)\|([^\]]+)\]\]/g, '$2')
		.replace(/\[\[[^\]|#]+\|([^\]]+)\]\]/g, '$1')
		.replace(/\[\[([^|\]]+)\]\]/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/<\/?[^>]+>/g, '')
		.replace(/[\\*_~]/g, '')
		.replace(/\{([^}]+)\}/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * @param {TocTree} headings
 * @returns {TocTree}
 */
function buildTocTree(headings) {
	/** @type {TocHeading} */
	const root = {
		title: '',
		id: '',
		level: 0,
		position: -1,
		children: []
	};
	/** @type {TocHeading[]} */
	const stack = [root];

	for (const heading of headings) {
		while (stack[stack.length - 1].level >= heading.level) {
			stack.pop();
		}

		stack[stack.length - 1].children.push(heading);
		stack.push(heading);
	}

	return root.children;
}

/**
 * Adds ids to markdown-rendered h2-h4 elements during the mdsvex/rehype pass.
 *
 * @param {{ minLevel?: number; maxLevel?: number }} [options]
 */
export function rehypeHeadingIds({ minLevel = 2, maxLevel = 4 } = {}) {
	/**
	 * @param {any} tree
	 */
	return function addHeadingIds(tree) {
		const slug = createHeadingSlugger();

		visitTree(tree, (node) => {
			if (node?.type !== 'element') return;
			if (typeof node.tagName !== 'string') return;

			const match = node.tagName.match(/^h([1-6])$/);
			if (!match) return;

			const level = Number(match[1]);
			if (level < minLevel || level > maxLevel) return;

			const title = hastNodeToText(node).replace(/\s+/g, ' ').trim();
			if (!title) return;

			node.properties = node.properties ?? {};
			node.properties.id = slug(title);
		});
	};
}

/**
 * @param {any} tree
 * @param {(node: any) => void} visitor
 */
function visitTree(tree, visitor) {
	visitor(tree);

	if (!tree || typeof tree !== 'object') return;

	const children = tree.children;
	if (!Array.isArray(children)) return;

	for (const child of children) {
		visitTree(child, visitor);
	}
}

/**
 * @param {any} node
 * @returns {string}
 */
function hastNodeToText(node) {
	if (!node || typeof node !== 'object') return '';
	if (node.type === 'text') return typeof node.value === 'string' ? node.value : '';
	if (!Array.isArray(node.children)) return '';

	return node.children.map(hastNodeToText).join('');
}

/**
 * @param {{ includeDiary?: boolean }} [options]
 */
export function articleTocPlugin({ includeDiary = true } = {}) {
	/** @type {string} */
	let root = process.cwd();

	/** @type {import('vite').Plugin} */
	const plugin = {
		name: 'article-toc',

		configResolved(config) {
			root = config.root;
		},

		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId;
		},

		load(id) {
			if (id !== resolvedVirtualModuleId) return;

			const { tocByRoute, files } = buildTocByRoute(root, { includeDiary });
			for (const file of files) this.addWatchFile(file);

			return `export const tocByRoute = ${JSON.stringify(tocByRoute, null, 2)};\n`;
		},

		handleHotUpdate(ctx) {
			if (!isRelevantSvxFile(ctx.file, root, { includeDiary })) return;

			const mod = ctx.server.moduleGraph.getModuleById(resolvedVirtualModuleId);
			if (mod) ctx.server.moduleGraph.invalidateModule(mod);
			ctx.server.ws.send({ type: 'full-reload' });

			return [];
		},

		configureServer(server) {
			/**
			 * @param {string} file
			 */
			const reload = (file) => {
				if (!isRelevantSvxFile(file, root, { includeDiary })) return;

				const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
				if (mod) server.moduleGraph.invalidateModule(mod);
				server.ws.send({ type: 'full-reload' });
			};

			server.watcher.on('add', reload);
			server.watcher.on('unlink', reload);
		}
	};

	return plugin;
}

/**
 * @param {string} root
 * @param {{ includeDiary?: boolean }} [options]
 * @returns {{ tocByRoute: TocByRoute; files: string[] }}
 */
export function buildTocByRoute(root, { includeDiary = true } = {}) {
	const routeRoot = path.join(root, 'src/routes/(article-shell)');
	const routeFiles = findFiles(routeRoot, (file) => toPosixPath(file).endsWith(routePageSuffix));
	/** @type {TocByRoute} */
	const tocByRoute = {};

	for (const file of routeFiles) {
		const source = fs.readFileSync(file, 'utf8');
		const toc = extractTocFromSvx(source);
		const routeId = routeIdFromRouteFile(file, root);
		const routePath = routePathFromRouteId(routeId);

		tocByRoute[routeId] = toc;
		tocByRoute[routePath] = toc;
	}

	const files = [...routeFiles];

	if (includeDiary) {
		const diaryRoot = path.join(root, 'src/content/diary');
		const diaryFiles = findFiles(diaryRoot, (file) => file.endsWith('.svx'));

		for (const file of diaryFiles) {
			const source = fs.readFileSync(file, 'utf8');
			const toc = extractTocFromSvx(source);
			const slug = path.basename(file, '.svx');

			tocByRoute[`/development-diary/${slug}`] = toc;
		}

		files.push(...diaryFiles);
	}

	return { tocByRoute, files };
}

/**
 * @param {string} file
 * @param {string} root
 */
export function routeIdFromRouteFile(file, root) {
	const relativePath = toPosixPath(path.relative(path.join(root, 'src/routes'), file));

	return `/${relativePath.slice(0, -routePageSuffix.length)}`;
}

/**
 * @param {string} routeId
 */
export function routePathFromRouteId(routeId) {
	const segments = routeId.split('/').filter(Boolean);
	const routeSegments = segments.filter((segment) => !/^\(.+\)$/.test(segment));

	return `/${routeSegments.join('/')}`;
}

/**
 * @param {string} file
 * @param {string} root
 * @param {{ includeDiary?: boolean }} [options]
 */
function isRelevantSvxFile(file, root, { includeDiary = true } = {}) {
	const relativePath = toPosixPath(path.relative(root, file));

	if (
		relativePath.startsWith('src/routes/(article-shell)/') &&
		relativePath.endsWith(routePageSuffix)
	) {
		return true;
	}

	return (
		includeDiary && relativePath.startsWith('src/content/diary/') && relativePath.endsWith('.svx')
	);
}

/**
 * @param {string} root
 * @param {(file: string) => boolean} predicate
 * @returns {string[]}
 */
function findFiles(root, predicate) {
	if (!fs.existsSync(root)) return [];

	/** @type {string[]} */
	const result = [];
	const entries = fs.readdirSync(root, { withFileTypes: true });

	for (const entry of entries) {
		const entryPath = path.join(root, entry.name);

		if (entry.isDirectory()) {
			result.push(...findFiles(entryPath, predicate));
			continue;
		}

		if (entry.isFile() && predicate(entryPath)) {
			result.push(entryPath);
		}
	}

	return result.sort();
}

/**
 * @param {string} value
 */
function toPosixPath(value) {
	return value.split(path.sep).join('/');
}
