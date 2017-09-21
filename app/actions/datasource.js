import nprogress from "nprogress";

import client from "helpers/mondrian";
import { Cube } from "helpers/classes";
import { flattenDrilldowns } from "helpers/manageDimensions";

export function requestCubes(dispatch) {
	nprogress.start();
	dispatch({ type: "CUBES_FETCH" });

	return client
		.cubes()
		.then(
			cubes => {
				cubes = []
					.concat(cubes)
					.filter(Boolean)
					.map(cb => new Cube(cb));

				dispatch({
					type: "CUBES_FETCH_SUCCESS",
					payload: cubes
				});
				dispatch({
					type: "CUBES_SET",
					payload: cubes[Math.floor(Math.random() * cubes.length)]
				});
			},
			error => {
				return dispatch({
					type: "CUBES_FETCH_ERROR",
					payload: error
				});
			}
		)
		.then(() => {
			nprogress.done();
		});
}

export function requestQuery(query) {
	return function(dispatch) {
		nprogress.done();

		if (!query || !query.drilldowns) return;

		nprogress.start();
		dispatch({ type: "DATA_FETCH" });

		let regex = RegExp("#?null", "i");

		client
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
