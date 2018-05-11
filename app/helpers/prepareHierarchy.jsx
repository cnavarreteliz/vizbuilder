export function prepareHierarchy(root) {
	return root.map(item => {
		let label = item.name,
			children = [];

		if (item.hierarchies) children = item.hierarchies[0].levels.slice(1);

		if (children.length > 1) {
			children = prepareHierarchy(children);
		} else if (children.length == 1) {
			item = children[0];
			children = [];
			if (label != item.name) label += " > " + item.name;
		}

		item._children = children;
		item._label = label;
		return item;
	});
}