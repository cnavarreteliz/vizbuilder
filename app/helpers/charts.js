export const BAR = {
	key: "BAR",
	name: "bar",
	nllabel: "a bar chart",
	icon: require("assets/charts/icon-bar.svg")
};
export const BUBBLE = {
	key: "BUBBLE",
	name: "bubble",
	nllabel: "a bubble chart",
	icon: require("assets/charts/icon-bubble.svg")
};
export const DONUT = {
	key: "DONUT",
	name: "donut",
	nllabel: "a donut chart",
	icon: require("assets/charts/icon-donut.svg")
};
export const PIE = {
	key: "PIE",
	name: "pie",
	nllabel: "a pie chart",
	icon: require("assets/charts/icon-pie.svg")
};
export const STACKED = {
	key: "STACKED",
	name: "stacked",
	nllabel: "a stacked chart",
	icon: require("assets/charts/icon-stacked.svg")
};
export const TABLE = {
	key: "TABLE",
	name: "table",
	nllabel: "a table",
	icon: require("assets/charts/icon-table.svg")
};
export const TREEMAP = {
	key: "TREEMAP",
	name: "treemap",
	nllabel: "a treemap",
	icon: require("assets/charts/icon-treemap.svg")
};
export const WORDCLOUD = {
	key: "WORDCLOUD",
	name: "wordcloud",
	nllabel: "a word cloud",
	icon: require("assets/charts/icon-wordcloud.svg")
};

const availables = [TREEMAP, DONUT, PIE, WORDCLOUD, BAR];

export function getChartByName(name) {
	return availables.find(chart => chart.name === name);
}

export function getCoherentTypes(dds) {
	dds = [].concat(dds);

	let hasTimeDim = dds.some(dd => dd.type === 1);
	// categoryCount = dds.reduce(function(sum, dd) { return sum + dd.drill})

	if (hasTimeDim) {
		return [TREEMAP, DONUT, PIE, BAR];
	} else {
		return [TREEMAP, DONUT, PIE, BAR, WORDCLOUD];
	}
}

export default availables;
