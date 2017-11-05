import union from "lodash/union";

/**
 * Creates a query to be sent to a Mondrian Server.
 * @param {Cube} cube 
 * @param {Array<Level>} levels 
 * @param {Array<Measure>} measures 
 * @param {Array<Cut>} cuts 
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
			return q.cut(
				ct.members.length === 1
					? generateMemberKey(ct.members[0])
					: `{${ct.members.map(generateMemberKey).join(",")}}`
			);
		}, query);
	}

	return query.option("nonempty", true).option("debug", !true);
}

/**
 * @param {Member} member 
 */
const generateMemberKey = member =>
	`[${member.level.dimensionName}].[${member.level.hierarchyName}].[${member
		.level.levelName}].&[${member.key}]`;
