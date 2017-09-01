import nprogress from "nprogress";
import { zip, some, every } from "lodash";
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

export function buildQuery(cube, drilldowns, measures, cuts) {
	let query = cube.query;

	if (drilldowns.length > 0) {
		query = measures.reduce(function(q, ms) {
			return q.measure(ms.name);
		}, query);

		query = drilldowns.reduce(function(q, dd) {
			return q.drilldown(
				dd.hierarchy.dimension.name,
				dd.hierarchy.name,
				dd.name
			);
		}, query);

		// query = cuts.reduce(function(q, ct) {
		// 	return q.cut(cutExpression(ct));
		// }, query);
	}

	return query.option("nonempty", true).option("debug", true);
}

export function requestQuery(query) {
	return function(dispatch) {
		nprogress.done();

		if (!query) return;

		nprogress.start();
		dispatch({ type: "DATA_FETCH" });

		let regex = RegExp("#?null$", "i");

		client
			.query(query)
			.then(
				request => {
					const data = request.data;
					return dispatch({
						type: "DATA_FETCH_SUCCESS",
						payload: flattenDrilldowns(data.axes, data.values)
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

function flattenDrilldowns(levels, values) {
	levels = [].concat(levels);
	var level = levels.pop().members;

	if (levels.length == 0)
		// MEASURES
		return [
			values.reduce(function(all, value, index) {
				let key = level[index].name;
				all[key] = value;
				return all;
			}, {})
		];
	else
		// DRILLDOWNS
		return zip(level, values).reduce(function(all, member) {
			let axis = member[0],
				value = flattenDrilldowns(levels, member[1]);
			value.forEach(item => (item[axis.level_name] = axis.name));
			return all.concat(value);
		}, []);
}

export default client;
