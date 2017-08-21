import { Client as MondrianClient } from "mondrian-rest-client";
import { CUBE_API } from "helpers/consts";

const client = new MondrianClient(CUBE_API);

export function requestCubes() {
	return function(dispatch) {
		return client.cubes().then(cubes => {
			return dispatch({
				type: "OPTIONS_UPDATE",
				cubes: cubes.map(cube => cube.name)
			});
		});
	};
}

export function requestQuery(cubeName, dimension, measure, year = 2016) {
	return function(dispatch) {
		return client
			.cube(cubeName)
			.then(cube => {
				dispatch({
					type: "AXIS_UPDATE",
					cube: cube.name
				});
				dispatch({
					type: "OPTIONS_UPDATE",
					dimensions: cube.dimensions.map(item => item.name),
					measures: cube.measures.map(item => item.name)
				});

				let query = cube.query
					.drilldown("Year", "Year")
					.drilldown(
						dimension,
						dimension,
						cube.dimensionsByName[dimension].hierarchies[0].levels[1].name
					)
					.measure(measure)
					.cut(`[Year].[Year].[Year].&[${year}]`);

				return client.query(query);
			})
			.then(request => request.data)
			.then(data => {
				dispatch({
					type: "DATA_UPDATE",
					payload: getMeaningfulArray(data.axes[2].members, data.values)
				});
			});
	};
}

function getMeaningfulArray(labels, values) {
	// if (labels.length != values.length)
	// 	throw new Error('Error unifying data: values are not the same as labels');

	return values.map(function(item, index) {
		let label = labels[index];
		return {
			year: 2016,
			value: item[0][0] * 1,
			id: label.key,
			name: label.name,
			group: label.name[0]
		};
	});
}

export default client;
