const externalWebUrlPattern = /^(?:https?:)?\/\//i;

/**
 * Opens external web links in a new tab.
 */
export function rehypeExternalLinks() {
	/**
	 * @param {any} tree
	 */
	return function transformExternalLinks(tree) {
		visitElements(tree, (node) => {
			if (node.tagName !== 'a') return;

			const href = String(node.properties?.href ?? '');
			if (!externalWebUrlPattern.test(href)) return;

			node.properties ??= {};
			node.properties.target = '_blank';
			node.properties.rel = 'noopener noreferrer';
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
