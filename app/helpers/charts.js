export const BAR = {
	key: "BAR",
	name: "bar",
	nllabel: "a bar chart"
};
export const BUBBLE = {
	key: "BUBBLE",
	name: "bubble",
	nllabel: "a bubble chart"
};
export const DONUT = {
	key: "DONUT",
	name: "donut",
	nllabel: "a donut chart"
};
export const PIE = {
	key: "PIE",
	name: "pie",
	nllabel: "a pie chart"
};
export const STACKED = {
	key: "STACKED",
	name: "stacked",
	nllabel: "a stacked chart"
};
export const TABLE = {
	key: "TABLE",
	name: "table",
	nllabel: "a table"
};
export const TREEMAP = {
	key: "TREEMAP",
	name: "treemap",
	nllabel: "a treemap"
};
export const WORDCLOUD = {
	key: "WORDCLOUD",
	name: "wordcloud",
	nllabel: "a word cloud"
};

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

export default [TREEMAP, DONUT, PIE, WORDCLOUD, BAR];
