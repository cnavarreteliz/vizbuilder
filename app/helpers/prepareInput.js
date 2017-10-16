import { flattenDimHierarchy } from "helpers/manageDimensions";

export function prepareSupercube(cubes) {
	const output = cubes.reduce((all, cube) => {
		flattenDimHierarchy(cube.dimensions).map(dm => {
			let item = {
				label: dm.dimension,
				...dm,
				measures: cube.measures
			};
			all.push(item);
		});
		return all;
	}, []);

	const result = output.reduce((r, a) => {
		r[a.label] = r[a.label] || [];
		r[a.label].push(a);
		return r;
	}, Object.create(null));

	return result;
}

export function generateColorSelector(measures) {
	return [].concat(
		{ name: "None", growthType: 0, measure: null },
		measures.reduce((all, ms) => {
			all.push({ name: ms.name, growthType: 0, measure: ms });
			if (!(/growth/i).test(ms.name) && ms.type !== "UNKNOWN") {
				all.push({ name: ms.name + " Growth", growthType: 1, measure: ms });
			}
			return all;
		}, [])
	)
}
