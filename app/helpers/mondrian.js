import union from "lodash/union";

/**
 * Creates a query to be sent to a Mondrian Server.
 * @param {Cube} cube 
 * @param {Array<Level>} drilldowns 
 * @param {Array<Measure>} measures 
 * @param {Array<Cut>} cuts 
 */
export function buildQuery(cube, drilldowns, measures, cuts) {
	let query = cube.query;

	if (!query) return;

	if (drilldowns.length > 0) {
		query = measures.reduce(function(q, ms) {
			return q.measure(ms.name);
		}, query);

		query = drilldowns.reduce(function(q, lv) {
			return q.drilldown(lv.dimension, lv.hierarchy, lv.level);
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
 * @param {MondrianMember} member 
 */
const generateMemberKey = member =>
	`[${member.level.dimension}].[${member.level.hierarchy}].[${member.level
		.name}].&[${member.key}]`;
