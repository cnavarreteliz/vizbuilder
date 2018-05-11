export function setChartOptions(aggr, measure) {
	let colorBy = aggr.colorBy[0] || {},
		groupBy = aggr.groupBy[0] || {},
		output = {
			x: "",
			y: "",
			type: "",
			year: "",
			colorScale: colorBy.name || "",
			groupBy: groupBy.level || ""
		};

	if (aggr.drilldowns.length > 1) {
		let xor = aggr.drilldowns[0].dimensionType === 0;
		output.x = aggr.drilldowns[xor ? 0 : 1].level;
		output.year = aggr.drilldowns[xor ? 1 : 0].level;
	} else if (aggr.drilldowns.length > 0) {
		output.x = aggr.drilldowns[0].level;
	}

	if (aggr.measures.filter(ms => ms.name === measure).length > 0) {
		output.y = aggr.measures.filter(ms => ms.name === measure)[0].name
		output.type = aggr.measures.filter(ms => ms.name === measure)[0].type
	}

	return output;
}
