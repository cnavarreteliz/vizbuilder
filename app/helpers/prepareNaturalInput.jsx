import { prepareHierarchy } from "helpers/prepareHierarchy";

export function prepareNaturalInput(cubes) {
	let data = [];
	var key = 0;
	cubes.map(cube => {
		let dimensions = prepareHierarchy(
			cube.dimensions.filter(dm => dm.dimensionType != 1)
		);
		let timeDimensions = cube.dimensions.filter(e => e.dimensionType == 1)
		let measures = getMeasures(cube.measures);
		dimensions.map(dm => {
			measures.map(ms => {
				if (dm._children.length == 0) {
					data.push({
						label: dm.name + " in " + cube.name + " sized by " + ms.name,
						value: key,
						options: {
							measure: ms,
							dimension: dm,
							cube: cube.name,
							timeDimensions: timeDimensions
						}
					});
					key += 1;
				} else {
					prepareHierarchy(dm._children).map(e => {
						data.push({
							label: e.name + " in " + cube.name + " sized by " + ms.name,
							value: key,
							options: {
								measure: ms,
								dimension: e,
								cube: cube.name,
								timeDimensions: timeDimensions
							}
						});
						key += 1;
					});
				}
			});
		});
	});
	return data.sort((a, b) => a.label.localeCompare(b.label));
}

function getMeasures(obj) {
	return obj.filter(
		e =>
			!(e.name.includes("Growth") ||
			e.name.includes("Average") ||
            e.name.includes("Median") ||
            e.name.includes("Percent"))
	);
}
