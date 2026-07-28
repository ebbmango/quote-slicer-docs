const quoteSlicerSourceUrlPattern =
	/^https:\/\/github\.com\/ebbmango\/quote-slicer\/(?:blob|tree)\/main\//;

/**
 * Opens monospace source links to the Quote Slicer GitHub repo in a new tab.
 *
 * @param {{ urlPattern?: RegExp }} [options]
 */
export function rehypeSourceLinks({ urlPattern = quoteSlicerSourceUrlPattern } = {}) {
	/**
	 * @param {any} tree
	 */
	return function transformSourceLinks(tree) {
		visitElements(tree, (node) => {
			if (node.tagName !== 'a') return;

			const href = String(node.properties?.href ?? '');
			if (!urlPattern.test(href) || !hasDirectCodeChild(node)) return;

			node.properties = {
				...node.properties,
				target: '_blank',
				rel: 'noopener noreferrer'
			};
		});
	};
}

/**
 * @param {any} node
 * @param {(node: any) => void} callback
 */
function visitElements(node, callback) {
	if (!node || typeof node !== 'object') return;

	if (node.type === 'element') {
		callback(node);
	}

	if (!Array.isArray(node.children)) return;

	for (const child of node.children) {
		visitElements(child, callback);
	}
}

/**
 * @param {any} node
 */
function hasDirectCodeChild(node) {
	return Array.isArray(node.children) && node.children.some(isCodeElement);
}

/**
 * @param {any} node
 */
function isCodeElement(node) {
	return node?.type === 'element' && node.tagName === 'code';
}
