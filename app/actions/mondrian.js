import nprogress from "nprogress";
import { Client as MondrianClient } from "mondrian-rest-client";
import { CUBE_API } from "assets/consts";

const client = new MondrianClient(CUBE_API);

export function requestCubes() {
	return function(dispatch) {
		nprogress.start();
		dispatch({ type: "CUBES_FETCH" });

		return client
			.cubes()
			.then(
				cubes => {
					return dispatch({
						type: "CUBES_FETCH_SUCCESS",
						payload: cubes
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
	};
}

export function requestAxisMembers(dim) {}

export function buildQuery(cube, drilldowns, measures, cuts) {
	let query = cube.query;

	if (drilldowns.length === 0) return query;

	query = measures.reduce(function(q, ms) {
		return q.measure(ms.name);
	}, query);

	query = drilldowns.reduce(function(q, dd) {
		return q.drilldown(dd.hierarchy.dimension.name, dd.hierarchy.name, dd.name);
	}, query);

	// query = cuts.reduce(function(q, ct) {
	// 	return q.cut(cutExpression(ct));
	// }, query);

	return query.option("nonempty", true).option("debug", true);
}

export function requestQuery(query) {
	return function(dispatch) {
		return query
			? client.query(query).then(request => request.data).then(data => {
					console.log(data)

					dispatch({
						type: "DATA_UPDATE",
						payload: parseMembers(data.axes, data.values)
					});
				})
			: false;
	};
}

function parseMembers(levels, values) {
	return [];
}

export default client;
