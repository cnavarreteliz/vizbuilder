// @ts-check

import { Client as MondrianClient } from "mondrian-rest-client";
import nprogress from "nprogress";

import { Cube } from "helpers/classes";
import { pickOne } from "helpers/random";
import { flattenDrilldowns } from "helpers/manageDimensions";

/** @type {MondrianClient} */
var client;

/**
 * Renewes the client element with a new source database.
 * @param {string} source URL to the new mondrian database server.
 */
export function resetClient(source) {
	client = new MondrianClient(source);
}

/**
 * Gets the available cube list from the current database.
 * @param {Function} dispatch Redux dispatch function.
 * @param {number} [attempt] Number of the current load attempt.
 */
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

				dispatch({
					type: "CUBES_FETCH_SUCCESS",
					payload: cubes
				});
				dispatch({
					type: "CUBES_SET",
					payload: pickOne(cubes)
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
