import fs from 'node:fs';
import path from 'node:path';
import {
	extractHeadingEntriesFromSvx,
	routeIdFromRouteFile,
	routePathFromRouteId,
	slugHeading
} from './articleToc.js';

const routePageSuffix = '/+page.svx';
const wikiLinkPattern = /\[\[([^\]\n]+?)\]\]/g;

/**
 * @typedef {{
 * 	title: string;
 * 	id: string;
 * 	level: number;
 * 	position: number;
 * 	children: unknown[];
 * }} HeadingEntry
 *
 * @typedef {{
 * 	title: string;
 * 	path: string;
 * 	file: string;
 * 	headings: HeadingEntry[];
 * 	headingById: Map<string, HeadingEntry>;
 * 	headingBySlug: Map<string, HeadingEntry>;
 * }} ArticleLinkEntry
 *
 * @typedef {{
 * 	articles: ArticleLinkEntry[];
 * 	articlesByFile: Map<string, ArticleLinkEntry>;
 * 	articlesByPath: Map<string, ArticleLinkEntry>;
 * 	articlesByAlias: Map<string, ArticleLinkEntry | null>;
 * }} ArticleLinkCatalog
 */

/**
 * Converts `[[article#heading|label]]` text nodes into mdast link nodes.
 *
 * Missing targets are non-fatal while the docs are still being written. If a
 * missing link has a label, the label is rendered as plain text; otherwise the
 * original wiki marker is left visible.
 *
 * @param {{ root?: string; basePath?: string }} [options]
 */
export function remarkArticleLinks({ root = process.cwd(), basePath = '' } = {}) {
	/**
	 * @param {any} tree
	 * @param {{ filename?: string; path?: string; history?: string[]; message?: (message: string) => void }} file
	 */
	return function transformArticleLinks(tree, file) {
		const catalog = buildArticleLinkCatalog(root);
		const currentArticle = currentArticleForFile(catalog, file, root);

		transformWikiLinks(tree, (link) => {
			const resolved = resolveArticleLink(catalog, {
				currentArticle,
				target: link.target,
				basePath
			});

			if (!resolved) {
				warn(file, unresolvedLinkMessage(link.target, currentArticle));
				return [{ type: 'text', value: link.label || link.raw }];
			}

			return [
				{
					type: 'link',
					url: resolved.href,
					title: null,
					children: [{ type: 'text', value: link.label || resolved.label }]
				}
			];
		});
	};
}

/**
 * @param {string} root
 * @param {{ includeDiary?: boolean }} [options]
 * @returns {ArticleLinkCatalog}
 */
export function buildArticleLinkCatalog(root, { includeDiary = true } = {}) {
	/** @type {ArticleLinkEntry[]} */
	const articles = [];
	const routeRoot = path.join(root, 'src/routes/(article-shell)');
	const routeFiles = findFiles(routeRoot, (file) => toPosixPath(file).endsWith(routePageSuffix));

	for (const file of routeFiles) {
		const source = fs.readFileSync(file, 'utf8');
		const routeId = routeIdFromRouteFile(file, root);
		const articlePath = routePathFromRouteId(routeId);

		articles.push(buildArticleEntry(file, articlePath, source));
	}

	if (includeDiary) {
		const diaryRoot = path.join(root, 'src/content/diary');
		const diaryFiles = findFiles(diaryRoot, (file) => file.endsWith('.svx'));

		for (const file of diaryFiles) {
			const source = fs.readFileSync(file, 'utf8');
			const slug = path.basename(file, '.svx');

			articles.push(buildArticleEntry(file, `/development-diary/${slug}`, source));
		}
	}

	return indexArticles(articles);
}

/**
 * @param {ArticleLinkCatalog} catalog
 * @param {{
 * 	currentArticle?: ArticleLinkEntry;
 * 	target: string;
 * 	basePath?: string;
 * }} options
 * @returns {{ href: string; label: string } | null}
 */
export function resolveArticleLink(catalog, { currentArticle, target, basePath = '' }) {
	const parsed = parseTarget(target);
	if (!parsed) return null;

	if (parsed.externalUrl) {
		return { href: parsed.externalUrl, label: parsed.externalUrl };
	}

	const article = parsed.articleRef ? findArticle(catalog, parsed.articleRef) : currentArticle;

	if (!article) return null;

	if (!parsed.headingRef) {
		return {
			href: withBase(article.path, basePath),
			label: article.title
		};
	}

	const heading = findHeading(article, parsed.headingRef);
	if (!heading) return null;

	const hash = `#${heading.id}`;
	const samePageHash = !parsed.articleRef && currentArticle?.path === article.path;

	return {
		href: samePageHash ? hash : `${withBase(article.path, basePath)}${hash}`,
		label: heading.title
	};
}

/**
 * @param {string} file
 * @param {string} articlePath
 * @param {string} source
 * @returns {ArticleLinkEntry}
 */
function buildArticleEntry(file, articlePath, source) {
	const headings = extractHeadingEntriesFromSvx(source);
	const title =
		frontmatterTitle(source) ??
		headings.find((heading) => heading.level === 1)?.title ??
		toTitle(articlePath);

	/** @type {Map<string, HeadingEntry>} */
	const headingById = new Map();
	/** @type {Map<string, HeadingEntry>} */
	const headingBySlug = new Map();

	for (const heading of headings) {
		headingById.set(heading.id, heading);
		addUnique(headingBySlug, slugHeading(heading.title), heading);
	}

	return {
		title,
		path: articlePath,
		file: toPosixPath(path.resolve(file)),
		headings,
		headingById,
		headingBySlug
	};
}

/**
 * @param {ArticleLinkEntry[]} articles
 * @returns {ArticleLinkCatalog}
 */
function indexArticles(articles) {
	/** @type {ArticleLinkCatalog} */
	const catalog = {
		articles,
		articlesByFile: new Map(),
		articlesByPath: new Map(),
		articlesByAlias: new Map()
	};

	for (const article of articles) {
		catalog.articlesByFile.set(article.file, article);
		catalog.articlesByPath.set(article.path, article);

		addArticleAlias(catalog, article.path, article);
		addArticleAlias(catalog, article.path.slice(1), article);
		addArticleAlias(catalog, path.basename(article.path), article);
		addArticleAlias(catalog, article.title, article);
	}

	return catalog;
}

/**
 * @param {ArticleLinkCatalog} catalog
 * @param {string} alias
 * @param {ArticleLinkEntry} article
 */
function addArticleAlias(catalog, alias, article) {
	const key = normalizeArticleAlias(alias);
	if (!key) return;

	const existing = catalog.articlesByAlias.get(key);
	if (existing && existing !== article) {
		catalog.articlesByAlias.set(key, null);
		return;
	}

	if (!catalog.articlesByAlias.has(key)) {
		catalog.articlesByAlias.set(key, article);
	}
}

/**
 * @param {ArticleLinkCatalog} catalog
 * @param {string} ref
 */
function findArticle(catalog, ref) {
	const pathRef = ref.startsWith('/') ? ref : `/${ref}`;

	return (
		catalog.articlesByPath.get(pathRef) ?? catalog.articlesByAlias.get(normalizeArticleAlias(ref))
	);
}

/**
 * @param {ArticleLinkEntry} article
 * @param {string} ref
 */
function findHeading(article, ref) {
	const trimmed = ref.trim();

	return (
		article.headingById.get(trimmed) ??
		article.headingById.get(slugHeading(trimmed)) ??
		article.headingBySlug.get(slugHeading(trimmed))
	);
}

/**
 * @param {string} target
 */
function parseTarget(target) {
	const trimmed = target.trim();
	if (!trimmed) return null;

	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
		return { externalUrl: trimmed };
	}

	const hashIndex = trimmed.indexOf('#');
	if (hashIndex === -1) {
		return { articleRef: trimmed, headingRef: '' };
	}

	return {
		articleRef: trimmed.slice(0, hashIndex).trim(),
		headingRef: trimmed.slice(hashIndex + 1).trim()
	};
}

/**
 * @param {string} value
 * @param {(link: { raw: string; target: string; label: string }) => any[]} resolve
 */
function wikiTextToNodes(value, resolve) {
	const nodes = [];
	let cursor = 0;

	for (const match of value.matchAll(wikiLinkPattern)) {
		const index = match.index ?? 0;
		if (index > cursor) {
			nodes.push({ type: 'text', value: value.slice(cursor, index) });
		}

		const raw = match[0];
		const [target = '', ...labelParts] = match[1].split('|');
		const label = labelParts.join('|').trim();
		nodes.push(...resolve({ raw, target: target.trim(), label }));
		cursor = index + raw.length;
	}

	if (cursor < value.length) {
		nodes.push({ type: 'text', value: value.slice(cursor) });
	}

	return nodes.length > 0 ? nodes : [{ type: 'text', value }];
}

/**
 * @param {any} node
 * @param {(link: { raw: string; target: string; label: string }) => any[]} resolve
 */
function transformWikiLinks(node, resolve) {
	if (!node || typeof node !== 'object') return;
	if (['code', 'inlineCode', 'html', 'link'].includes(node.type)) return;

	const children = node.children;
	if (!Array.isArray(children)) return;

	for (let index = 0; index < children.length; index += 1) {
		const replacement = wikiReferenceToNodes(children, index, resolve);
		if (replacement) {
			children.splice(index, 3, ...replacement);
			index = Math.max(index + replacement.length - 2, -1);
			continue;
		}

		const child = children[index];

		if (child?.type === 'text' && typeof child.value === 'string' && child.value.includes('[[')) {
			children.splice(index, 1, ...wikiTextToNodes(child.value, resolve));
			continue;
		}

		transformWikiLinks(child, resolve);
	}
}

/**
 * Markdown parses `[[target]]` as text `[` + shortcut link reference + text `]`.
 *
 * @param {any[]} children
 * @param {number} index
 * @param {(link: { raw: string; target: string; label: string }) => any[]} resolve
 */
function wikiReferenceToNodes(children, index, resolve) {
	const before = children[index];
	const reference = children[index + 1];
	const after = children[index + 2];

	if (before?.type !== 'text' || typeof before.value !== 'string' || !before.value.endsWith('[')) {
		return null;
	}

	if (
		reference?.type !== 'linkReference' ||
		reference.referenceType !== 'shortcut' ||
		typeof reference.label !== 'string'
	) {
		return null;
	}

	if (after?.type !== 'text' || typeof after.value !== 'string' || !after.value.startsWith(']')) {
		return null;
	}

	const nodes = [];
	const beforeText = before.value.slice(0, -1);
	const afterText = after.value.slice(1);
	const [target = '', ...labelParts] = reference.label.split('|');
	const label = labelParts.join('|').trim();

	if (beforeText) nodes.push({ type: 'text', value: beforeText });
	nodes.push(...resolve({ raw: `[[${reference.label}]]`, target: target.trim(), label }));
	if (afterText) nodes.push({ type: 'text', value: afterText });

	return nodes;
}

/**
 * @param {ArticleLinkCatalog} catalog
 * @param {{ filename?: string; path?: string; history?: string[] }} file
 * @param {string} root
 */
function currentArticleForFile(catalog, file, root) {
	const rawPath = file?.filename ?? file?.path ?? file?.history?.[0];
	if (!rawPath) return undefined;

	const absolutePath = path.isAbsolute(rawPath) ? rawPath : path.resolve(root, rawPath);

	return catalog.articlesByFile.get(toPosixPath(absolutePath));
}

/**
 * @param {Map<string, HeadingEntry>} map
 * @param {string} key
 * @param {HeadingEntry} value
 */
function addUnique(map, key, value) {
	if (!map.has(key)) map.set(key, value);
}

/**
 * @param {string} pathValue
 * @param {string} basePath
 */
function withBase(pathValue, basePath) {
	if (!basePath) return pathValue;

	return `${basePath.replace(/\/$/, '')}${pathValue}`;
}

/**
 * @param {string} value
 */
function normalizeArticleAlias(value) {
	return value
		.trim()
		.replace(/^\/+|\/+$/g, '')
		.split('/')
		.filter(Boolean)
		.map(slugHeading)
		.join('/');
}

/**
 * @param {string} source
 */
function frontmatterTitle(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) return undefined;

	const title = match[1].match(/^title:\s*(.+)\s*$/m)?.[1]?.trim();
	if (!title) return undefined;

	return title.replace(/^['"]|['"]$/g, '');
}

/**
 * @param {string} articlePath
 */
function toTitle(articlePath) {
	const slug = articlePath.split('/').filter(Boolean).at(-1) ?? 'article';

	return slug
		.split('-')
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * @param {{ message?: (message: string) => void } | undefined} file
 * @param {string} message
 */
function warn(file, message) {
	if (typeof file?.message === 'function') {
		file.message(message);
	}
}

/**
 * @param {string} target
 * @param {ArticleLinkEntry | undefined} currentArticle
 */
function unresolvedLinkMessage(target, currentArticle) {
	const location = currentArticle ? ` in ${currentArticle.path}` : '';

	return `Unresolved article link${location}: [[${target}]]`;
}

/**
 * @param {string} root
 * @param {(file: string) => boolean} predicate
 * @returns {string[]}
 */
function findFiles(root, predicate) {
	if (!fs.existsSync(root)) return [];

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
