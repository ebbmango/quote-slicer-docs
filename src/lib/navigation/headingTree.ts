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
	const root: HeadingTree = {
		title: null,
		level: 0,
		element: null,
		children: [],
		position: -1
	};

	const stack: Array<Heading | HeadingTree> = [root];

	let position = 0;

	// Move back up the current branch until we find a valid parent:
	// the parent must be a heading with a baser level than `next`.
	for (const node of nodeList) {
		const next: Heading = {
			title: node.textContent,
			element: node,
			level: Number(node.nodeName[1]),
			children: [],
			position
		};

		position += 1;

		// Move back up the current branch until we find a valid parent:
		// the parent must be a heading with a baser level than the next.
		while (stack[stack.length - 1].level >= next.level) {
			stack.pop();
		}

		// Add the new heading as a child of that parent.
		stack[stack.length - 1].children.push(next);

		// Make this heading the current branch for following headings.
		stack.push(next);
	}

	return root;
}
