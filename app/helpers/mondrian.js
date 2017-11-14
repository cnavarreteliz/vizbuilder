import union from "lodash/union";

/**
 * Creates a query to be sent to a Mondrian Server.
 * @param {Cube} cube 
 * @param {Array<Level>} levels 
 * @param {Array<Measure>} measures 
 * @param {Array<Filter>} cuts 
 */
export function buildQuery(cube, levels, measures, cuts) {
	let query = cube.query;

	if (!query) return;

	if (levels.length > 0) {
		query = measures.reduce(function(q, ms) {
			return q.measure(ms.name);
		}, query);

		query = levels.reduce(function(q, lv) {
			return q.drilldown(lv.dimensionName, lv.hierarchyName, lv.levelName);
		}, query);

		query = cuts.reduce(function(q, ct) {
			/** @type {Level} */
			let level = ct.property,
				levelString = `[${level.dimensionName}].[${level.hierarchyName}].[${level.levelName}]`;

			let cut_expression = ct.value.map(member => `${levelString}.&[${member.key}]`);

			return q.cut(
				cut_expression.length > 1
					? `{${cut_expression.join(",")}}`
					: cut_expression[0]
			);
		}, query);
	}

	return query.option("nonempty", true).option("debug", !true);
}
