import { flattenDimHierarchy } from "helpers/manageDimensions";

export function SuperCube(cubes) {
	const output = cubes.reduce((all, cube) => {
		flattenDimHierarchy(cube.dimensions).map(dm => {
			let item = {
				label: dm.name + " > " + cube.name,
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

	console.log(result);
}

export function generateColorSelector(measures) {
	return measures.reduce((all, ms) => {
		all.push({ name: ms.name, growthType: 0, measure: ms });
		if (!ms.name.includes("Growth")) {
			all.push({ name: ms.name + " Growth", growthType: 1, measure: ms });
		}
		return all;
	}, []);
}
