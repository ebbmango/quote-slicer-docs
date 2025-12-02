import { resolve } from '$app/paths';
import type { Pathname } from '$app/types';
import type { ResolvedPathname } from '$app/types';

export type NavItem = {
	title: string;
	slug?: ResolvedPathname;
	children?: NavItem[];
	icon?: any;
};

export const docsStructure: NavItem[] = [
	{ title: 'Overview', slug: resolve('/overview') },
	{
		title: 'Components',
		children: [{ title: 'Quote Workbench', slug: resolve('/components/quote-workbench') }]
	},
	{
		title: 'Data Structures',
		children: [{ title: 'Mapping', slug: resolve('/data-structures/mapping') }]
	},
	{
		title: 'Functionalities',
		children: [
			{ title: 'Tokenization', slug: resolve('/functionalities/tokenization') },
			{ title: 'Quote Tokenization', slug: resolve('/functionalities/quote-tokenization') },
			{
				title: 'Translation Tokenization',
				slug: resolve('/functionalities/translation-tokenization')
			}
		]
	},

	{ title: 'Development Diary', slug: resolve('/development-diary') }
];
