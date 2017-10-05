import nprogress from "nprogress";

import {getClient} from "helpers/mondrian";
import { Cube } from "helpers/classes";
import { pickOne } from "helpers/random";
import { flattenDrilldowns } from "helpers/manageDimensions";

export function requestCubes(dispatch, attempt) {
	nprogress.start();
	dispatch({ type: "CUBES_FETCH" });

	return getClient()
		.cubes()
		.then(
			cubes => {
				cubes = []
					.concat(cubes)
					.filter(Boolean)
					.map(cb => new Cube(cb));

				let cube = pickOne(cubes);

				dispatch({
					type: "CUBES_FETCH_SUCCESS",
					payload: cubes
				});
				dispatch({
					type: "CUBES_SET",
					payload: cube
				});
				dispatch({
					type: "DRILLDOWN_SET",
					payload: cube.dimensions[cube.dimensions.length - 1].drilldowns[0]
				});
				dispatch({
					type: "MEASURE_SET",
					payload: cube.measures[0]
				});
			},
			error => {
				let attempts = (attempt || 0) + 1;

				if (attempts < 3) {
					return requestCubes(dispatch, attempts);
				} else {
					return dispatch({
						type: "CUBES_FETCH_ERROR",
						payload: error
					});
				}
			}
		)
		.then(() => {
			nprogress.done();
		});
}

export function requestQuery(query, attempt) {
	return function(dispatch) {
		nprogress.done();

		if (!query || !query.drilldowns) return;

		nprogress.start();
		dispatch({ type: "DATA_FETCH" });

		return getClient()
			.query(query)
			.then(
				request => {
					let dataset = flattenDrilldowns(
						request.data.axes,
						request.data.values
					);

					return dispatch({
						type: "DATA_FETCH_SUCCESS",
						payload: dataset
					});
				},
				error => {
					let attempts = (attempt || 0) + 1;

					if (attempts < 3) {
						nprogress.set(0.0);
						return new Promise(function(resolve) {
							setTimeout(resolve, attempts * 1000);
						}).then(() => requestQuery(query, attempts)(dispatch));
					}

					return dispatch({
						type: "DATA_FETCH_ERROR",
						payload: error
					});
				}
			)
			.then(() => {
				nprogress.done();
			});
	};
}
