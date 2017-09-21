import { Client as MondrianClient } from "mondrian-rest-client";

import { CUBE_API } from "helpers/consts";

const client = new MondrianClient(CUBE_API);

export function buildQuery(cube, drilldowns, measures, cuts) {
	let query = cube.query;

	if (drilldowns.length > 0) {
		query = measures.reduce(function(q, ms) {
			return q.measure(ms.name);
		}, query);

		query = drilldowns.reduce(function(q, lv) {
			return q.drilldown(lv.dimension, lv.hierarchy, lv.level);
		}, query);

		// query = cuts.reduce(function(q, ct) {
		// 	return q.cut(cutExpression(ct));
		// }, query);
	}

	return query.option("nonempty", true).option("debug", true);
}

export default client;
