export const BAR = {
	key: "bar",
	name: "bar chart",
	icon: "timeline-bar-chart"
};
export const BUBBLE = {
	key: "bubble",
	name: "bubble chart",
	icon: "heatmap"
};
export const DONUT = {
	key: "donut",
	name: "donut chart",
	icon: "doughnut-chart"
};
export const LINEPLOT = {
	key: "lineplot",
	name: "line plot",
	icon: "timeline-line-chart"
};
export const PIE = {
	key: "pie",
	name: "pie chart",
	icon: "pie-chart"
};
export const STACKED = {
	key: "stacked",
	name: "stacked chart",
	icon: "timeline-area-chart"
};
export const TABLE = {
	key: "table",
	name: "table",
	icon: "th"
};
export const TREEMAP = {
	key: "treemap",
	name: "treemap",
	icon: "control"
};
export const WORDCLOUD = {
	key: "wordcloud",
	name: "word cloud",
	icon: ""
};

const availables = [TREEMAP, DONUT, PIE, LINEPLOT, BUBBLE, STACKED, BAR, TABLE];

export function getChartByName(name) {
	return availables.find(chart => chart.name === name);
}

export default availables;
