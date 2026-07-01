/**
 * Nests a flat, in-order list of level-bearing nodes into a tree.
 *
 * Each node becomes a child of the nearest preceding node with a smaller
 * `level`; equal-or-higher levels pop back up the current branch. Mutates each
 * node's `children` array in place and returns the top-level nodes. Shared by
 * the build-time ToC extractor and the runtime DOM heading walker so both nest
 * headings identically.
 *
 * @template {{ level: number; children: T[] }} T
 * @param {T[]} items
 * @returns {T[]}
 */
export function nestByLevel(items) {
	/** @type {{ level: number; children: T[] }} */
	const root = { level: 0, children: [] };
	/** @type {Array<{ level: number; children: T[] }>} */
	const stack = [root];

	for (const item of items) {
		while (stack[stack.length - 1].level >= item.level) {
			stack.pop();
		}

		stack[stack.length - 1].children.push(item);
		stack.push(item);
	}

	return root.children;
}
