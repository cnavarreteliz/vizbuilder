import { Client as MondrianClient } from "mondrian-rest-client";
import unzipWith from "lodash/unzipWith";

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
 * @param {(message: ReduxMessage) => void} dispatch Redux dispatch function.
 */
export function requestCubes(dispatch) {
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
			error =>
				dispatch({
					type: "CUBES_FETCH_ERROR",
					payload: error
				})
		)
		.then(null, error => {
			console.error(error.stack);
		});
}

export function requestMembers(level) {
	// TODO: add routine FETCH/SUCCESS/ERROR
	return function(dispatch) {
		return client.members(level).then(members => {
			dispatch({
				type: "DRILLDOWN_MEMBERS_GET",
				level: level,
				members: members.map(m => ({ ...m, level: level }))
			});
		});
	};
}

export function requestQuery(query) {
	return function(dispatch) {
		if (!query || !query.drilldowns) return;

		dispatch({ type: "DATA_FETCH" });

		return client
			.query(query)
			.then(
				request => {
					/**
					 * flattenDrilldowns inflates the values in the format that comes
					 * from mondrian, and generates an array where each element is
					 * an object with pairs key-value as the properties and its values
					 * for that row.
					 */
					let values = flattenDrilldowns(
						request.data.axes,
						request.data.values
					);

					/**
					 * this array is basically the same as req.data.axis_dimensions,
					 * but adds a members property: an array with all the possible 
					 * values for that axis.
					 */
					let dimensions = unzipWith(
						[request.data.axis_dimensions, request.data.axes],
						(dimension, axes) => ({ ...dimension, members: axes.members })
					);

					return dispatch({
						type: "DATA_FETCH_SUCCESS",
						payload: { dimensions, values }
					});
				},
				error =>
					dispatch({
						type: "DATA_FETCH_ERROR",
						payload: error
					})
			)
			.then(null, error => {
				console.error(error.stack);
			});
	};
}
