import union from "lodash/union";

/**
 * Creates a query to be sent to a Mondrian Server.
 * @param {Cube} cube 
 * @param {Array<Drillable>} drilldowns 
 * @param {Array<Measure>} measures 
 * @param {Array<Cut>} cuts 
 */
export function buildQuery(cube, drilldowns, measures, cuts) {
	let query = cube.query;

	if (drilldowns.length > 0) {
		query = measures.reduce(function(q, ms) {
			return q.measure(ms.name);
		}, query);

		let dd_original = drilldowns.length;
		cube.timeDimensions.some(dim => {
			let flag = false,
				levels = dim.drilldowns;

			for (let d = 0; d < dd_original; d++) {
				let dd = drilldowns[d];

				for (let l = 0; l < levels.length; l++) {
					let lv = levels[l];

					if (dd.hierarchy !== lv.hierarchy) {
						drilldowns.push(lv);
						return true;
					}
				}
			}
		});
		
		query = union(drilldowns).reduce(function(q, lv) {
			return q.drilldown(lv.dimension, lv.hierarchy, lv.level);
		}, query);

		// query = cuts.reduce(function(q, ct) {
		// 	return q.cut(cutExpression(ct));
		// }, query);
	}

	return query.option("nonempty", true).option("debug", true);
}
