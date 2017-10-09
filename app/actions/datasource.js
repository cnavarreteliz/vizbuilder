import { Client as MondrianClient } from "mondrian-rest-client";
import nprogress from "nprogress";

import { Cube } from "helpers/classes";
import { pickOne } from "helpers/random";
import { flattenDrilldowns } from "helpers/manageDimensions";

var client;

export function resetClient(source) {
	client = new MondrianClient(source);
}

export function requestCubes(dispatch, attempt) {
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
					payload: cube.dimensions[
						Math.floor(Math.random() * (cube.dimensions.length))
					].drilldowns[0]
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

		return client
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
