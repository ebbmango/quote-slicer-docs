import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const contentDirectory = resolve('src/content/diary');
const outputDirectory = resolve('src/lib/generated');
const outputFile = resolve(outputDirectory, 'diary-index.ts');

function parseScalar(value) {
	const trimmedValue = value.trim();

	if (trimmedValue === 'true') return true;
	if (trimmedValue === 'false') return false;

	if (
		(trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
		(trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
	) {
		return trimmedValue.slice(1, -1);
	}

	return trimmedValue;
}

function parseFrontmatter(source, filename) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

	if (!match) {
		throw new Error(`Missing frontmatter in ${filename}`);
	}

	const attributes = {};
	let activeArrayKey = null;

	for (const line of match[1].split(/\r?\n/)) {
		if (!line.trim()) continue;

		const arrayItem = line.match(/^\s*-\s*(.+)\s*$/);
		if (arrayItem && activeArrayKey) {
			attributes[activeArrayKey].push(parseScalar(arrayItem[1]));
			continue;
		}

		activeArrayKey = null;

		const property = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
		if (!property) {
			throw new Error(`Unsupported frontmatter line "${line}" in ${filename}`);
		}

		const [, key, value = ''] = property;

		if (value === '') {
			attributes[key] = [];
			activeArrayKey = key;
			continue;
		}

		attributes[key] = parseScalar(value);
	}

	return attributes;
}

function parseDate(value, fieldName, filename) {
	const date = String(value ?? '').trim();
	const timestamp = Number.parseInt(String(Date.parse(date)), 10);

	if (!date || Number.isNaN(timestamp)) {
		throw new Error(`Missing or invalid "${fieldName}" in ${filename}`);
	}

	return { date, timestamp };
}

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

function gitLastUpdated(relativePath) {
	try {
		const output = execFileSync('git', ['log', '-1', '--format=%cs', '--', relativePath], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore']
		}).trim();

		return output || null;
	} catch {
		return null;
	}
}

function resolveLastUpdated(metadata, filename, filepath, relativePath) {
	if (metadata.lastUpdated !== undefined) {
		return parseDate(metadata.lastUpdated, 'lastUpdated', filename);
	}

	const gitDate = gitLastUpdated(relativePath);
	if (gitDate) {
		return parseDate(gitDate, 'lastUpdated', filename);
	}

	return parseDate(formatDate(statSync(filepath).mtime), 'lastUpdated', filename);
}

function buildDiaryEntry(filename) {
	const filepath = resolve(contentDirectory, filename);
	const relativePath = `src/content/diary/${filename}`;
	const source = readFileSync(filepath, 'utf8');
	const metadata = parseFrontmatter(source, filename);
	const slug = basename(filename, '.svx');
	const { date, timestamp } = parseDate(metadata.date, 'date', filename);
	const { date: lastUpdated, timestamp: lastUpdatedTimestamp } = resolveLastUpdated(
		metadata,
		filename,
		filepath,
		relativePath
	);

	if (!metadata.title) {
		throw new Error(`Missing "title" in ${filename}`);
	}

	if (!metadata.summary) {
		throw new Error(`Missing "summary" in ${filename}`);
	}

	if (!/^[a-z0-9-]+$/.test(slug)) {
		throw new Error(`Invalid diary slug "${slug}" in ${filename}`);
	}

	const tags = Array.isArray(metadata.tags) ? metadata.tags.map(String) : [];
	const published = metadata.published !== false;

	return {
		slug,
		path: `/development-diary/${slug}`,
		contentPath: `/src/content/diary/${filename}`,
		title: String(metadata.title),
		date,
		timestamp,
		lastUpdated,
		lastUpdatedTimestamp,
		summary: String(metadata.summary),
		tags,
		searchText: [metadata.title, metadata.summary, slug, ...tags].join(' ').toLowerCase(),
		published
	};
}

const diaryEntries = readdirSync(contentDirectory, { withFileTypes: true })
	.filter((entry) => entry.isFile() && entry.name.endsWith('.svx'))
	.map((entry) => buildDiaryEntry(entry.name))
	.filter((entry) => entry.published)
	.map(({ published, ...entry }) => entry)
	.sort((left, right) => right.timestamp - left.timestamp);

const generatedSource = `export type DiaryIndexEntry = {
\tslug: string;
\tpath: string;
\tcontentPath: string;
\ttitle: string;
\tdate: string;
\ttimestamp: number;
\tlastUpdated: string;
\tlastUpdatedTimestamp: number;
\tsummary: string;
\ttags: string[];
\tsearchText: string;
};

export const diaryEntries: DiaryIndexEntry[] = ${JSON.stringify(diaryEntries, null, '\t')};
`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputFile, generatedSource);
