import includes from "lodash/includes";
import zip from "lodash/zip";
import differenceBy from "lodash/differenceBy";

export function simplifyDimHierarchy(root) {
	return root.map(item => {
		let label = item.name,
			children = [];

		if (item.hierarchies) {
			children = item.hierarchies[0].levels.slice(1);
		}

		if (children.length > 1) {
			children = simplifyDimHierarchy(children);
		} else if (children.length === 1) {
			item = children[0];
			children = [];
			if (label !== item.name) label += " > " + item.name;
		}

		item._children = children;
		item._label = label;
		return item;
	});
}

export function flattenDimHierarchy(dimensions) {
	return dimensions.reduce(function(output, dim) {
		let hierarchies = (dim.hierarchies || []).reduce(function(output, hie) {
			let levels = (hie.levels || [])
				.map(function(lvl, index) {
					lvl = { ...lvl };

					if (includes(hie.name, lvl.name)) {
						lvl.name = hie.name;
					} else if (lvl.name !== hie.name && !includes(lvl.name, hie.name)) {
						lvl.name = `${lvl.name} (${hie.name})`;
					}

					return index > 0 ? lvl : null;
				})
				.filter(Boolean);

			return output.concat(levels);
		}, []);

		return output.concat(hierarchies);
	}, []);
}

export function flattenDrilldowns(levels, values) {
	levels = [].concat(levels);
	var level = levels.pop().members;

	if (levels.length > 0)
		// DRILLDOWNS
		return zip(level, values).reduce(function(all, member) {
			let axis = member[0],
				value = flattenDrilldowns(levels, member[1]);

			value.forEach(function(item) {
				item[axis.level_name] = axis.name;
			});

			axis = null;

			return all.concat(value);
		}, []);
	else
		// MEASURES
		return [
			values.reduce(function(all, value, index) {
				if (!isNaN(value)) {
					let key = level[index].name;
					all[key] = value;
				}
				return all;
			}, {})
		];
}

/**
 * Returns the first Level from *available* that doesn't belongs to a hierarchy
 * from *excluded*.
 * @param {Cube} cube 
 * @param {Array<Level>} excluded 
 * @returns {Level}
 */
export function pickUnconflictingTimeDrilldown(cube, excluded) {
	let available = cube.timeDimensions.reduce(function(all, dimension) {
		return all.concat(dimension.levels);
	}, []);
	return differenceBy(available, excluded, "hierarchy")[0];
}
