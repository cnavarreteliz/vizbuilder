export const BAR = {
	key: "BAR",
	name: "bar",
	nllabel: "bar chart",
	icon: require("assets/charts/icon-bar.svg")
};
export const BUBBLE = {
	key: "BUBBLE",
	name: "bubble",
	nllabel: "bubble chart",
	icon: require("assets/charts/icon-bubble.svg")
};
export const DONUT = {
	key: "DONUT",
	name: "donut",
	nllabel: "donut chart",
	icon: require("assets/charts/icon-donut.svg")
};
export const LINEPLOT = {
	key: "LINEPLOT",
	name: "lineplot",
	nllabel: "line plot",
	icon: require("assets/charts/icon-lineplot.svg")
};
export const PIE = {
	key: "PIE",
	name: "pie",
	nllabel: "pie chart",
	icon: require("assets/charts/icon-pie.svg")
};
export const STACKED = {
	key: "STACKED",
	name: "stacked",
	nllabel: "stacked chart",
	icon: require("assets/charts/icon-stacked.svg")
};
export const TABLE = {
	key: "TABLE",
	name: "table",
	nllabel: "table",
	icon: require("assets/charts/icon-table.svg")
};
export const TREEMAP = {
	key: "TREEMAP",
	name: "treemap",
	nllabel: "treemap",
	icon: require("assets/charts/icon-treemap.svg")
};
export const WORDCLOUD = {
	key: "WORDCLOUD",
	name: "wordcloud",
	nllabel: "word cloud",
	icon: require("assets/charts/icon-wordcloud.svg")
};

const availables = [TREEMAP, DONUT, PIE, LINEPLOT, BUBBLE, STACKED, BAR];

export function getChartByName(name) {
	return availables.find(chart => chart.name === name);
}

export function getCoherentTypes(dds) {
	dds = [].concat(dds);

	let hasTimeDim = dds.some(dd => dd.type === 1);
	// categoryCount = dds.reduce(function(sum, dd) { return sum + dd.drill})

	if (hasTimeDim) {
		return [TREEMAP, DONUT, PIE, BUBBLE, STACKED, BAR];
	} else {
		return [TREEMAP, DONUT, PIE, BAR];
	}
}

export default availables;
