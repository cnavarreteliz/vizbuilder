export const BAR = {
	key: "BAR",
	name: "bar",
	nllabel: "bar chart",
	icon: "timeline-bar-chart"
};
export const BUBBLE = {
	key: "BUBBLE",
	name: "bubble",
	nllabel: "bubble chart",
	icon: "heatmap"
};
export const DONUT = {
	key: "DONUT",
	name: "donut",
	nllabel: "donut chart",
	icon: "doughnut-chart"
};
export const LINEPLOT = {
	key: "LINEPLOT",
	name: "lineplot",
	nllabel: "line plot",
	icon: "timeline-line-chart"
};
export const PIE = {
	key: "PIE",
	name: "pie",
	nllabel: "pie chart",
	icon: "pie-chart"
};
export const STACKED = {
	key: "STACKED",
	name: "stacked",
	nllabel: "stacked chart",
	icon: "timeline-area-chart"
};
export const TABLE = {
	key: "TABLE",
	name: "table",
	nllabel: "table",
	icon: "th"
};
export const TREEMAP = {
	key: "TREEMAP",
	name: "treemap",
	nllabel: "treemap",
	icon: "control"
};
export const WORDCLOUD = {
	key: "WORDCLOUD",
	name: "wordcloud",
	nllabel: "word cloud",
	icon: ""
};

const availables = [TREEMAP, DONUT, PIE, LINEPLOT, BUBBLE, STACKED, BAR, TABLE];

export function getChartByName(name) {
	return availables.find(chart => chart.name === name);
}

export function getCoherentTypes(dds) {
	dds = [].concat(dds);

	let hasTimeDim = dds.some(dd => dd.type === 1);
	// categoryCount = dds.reduce(function(sum, dd) { return sum + dd.drill})

	if (hasTimeDim) {
		return [TREEMAP, DONUT, PIE, BUBBLE, STACKED, BAR, TABLE];
	} else {
		return [TREEMAP, DONUT, PIE, BAR];
	}
}

export default availables;
