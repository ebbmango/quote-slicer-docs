import { nestByLevel } from '../nestByLevel';

export type Heading = {
	title: string | null;
	level: number;
	element: HTMLHeadingElement;
	children: Heading[];
	position: number;
};

export type HeadingTree = {
	title: null;
	level: 0;
	element: null;
	children: Heading[];
	position: -1;
};

export function buildHeadingTree(nodeList: NodeListOf<HTMLHeadingElement>): HeadingTree {
	const headings: Heading[] = [];
	let position = 0;

	for (const node of nodeList) {
		headings.push({
			title: node.textContent,
			element: node,
			level: Number(node.nodeName[1]),
			children: [],
			position: position++
		});
	}

	return {
		title: null,
		level: 0,
		element: null,
		children: nestByLevel(headings),
		position: -1
	};
}
