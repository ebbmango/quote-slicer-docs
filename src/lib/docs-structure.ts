export type NavItem = {
	title: string;
	slug?: string;
	children?: NavItem[];
	icon?: any;
};

export const docsStructure: NavItem[] = [
	{ title: 'Overview', slug: '/overview' },
	{
		title: 'Components',
		children: [{ title: 'Quote Workbench', slug: '/components/quote-workbench' }]
	},
	{
		title: 'Data Structures',
		children: [{ title: 'Mapping', slug: '/data-structures/mapping' }]
	},
	{
		title: 'Functionalities',
		children: [
			{ title: 'Tokenization', slug: '/functionalities/tokenization' },
			{ title: 'Quote Tokenization', slug: '/functionalities/quote-tokenization' },
			{ title: 'Translation Tokenization', slug: '/functionalities/quote-tokenization' }
		]
	},
	{ title: 'Development Diary', slug: '/development-diary' }
];
