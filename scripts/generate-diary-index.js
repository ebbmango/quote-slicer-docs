import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

function buildDiaryEntry(filename) {
	const filepath = resolve(contentDirectory, filename);
	const source = readFileSync(filepath, 'utf8');
	const metadata = parseFrontmatter(source, filename);
	const slug = basename(filename, '.svx');
	const timestamp = Number.parseInt(
		String(Date.parse(String(metadata.date ?? ''))),
		10
	);

	if (!metadata.title) {
		throw new Error(`Missing "title" in ${filename}`);
	}

	if (!metadata.date || Number.isNaN(timestamp)) {
		throw new Error(`Missing or invalid "date" in ${filename}`);
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
		date: String(metadata.date),
		timestamp,
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
\tsummary: string;
\ttags: string[];
\tsearchText: string;
};

export const diaryEntries: DiaryIndexEntry[] = ${JSON.stringify(diaryEntries, null, '\t')};
`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputFile, generatedSource);
