import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";
import { groupLowestCategories } from "helpers/prepareViz";

import { prepareGrowth } from "helpers/prepareViz"

import "styles/Chart.css";

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function abbreviateNumber(num, fixed = 0) {
	if (num === null) {
		return null;
	} // terminate early
	if (num === 0) {
		return "0";
	} // terminate early
	fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
	var b = num.toPrecision(2).split("e"), // get power
		k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
		c =
			k < 1
				? num.toFixed(0 + fixed)
				: (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
		d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
		e = d + ["", "K", "M", "B", "T"][k]; // append power
	return e;
}

const CHARTCONFIG = {
	colorScaleConfig : { color: ["#88B0D8", "#3F51B5"] },
	shapeConfig: {
		fontFamily: "Fira Sans Condensed"
	},
	tooltipConfig: {
		padding: "10px",
		width: "200px",
		background: "white",
		title: d => d.name,
		titleStyle: {
			"font-size": "18px",
			"text-transform": "uppercase",
			"font-weight": "bold",
			"font-family": "'Pathway Gothic One', sans-serif",
			"margin-bottom": "12px"
		},
		body(item) {
			item = item.source;
			return Object.keys(item).reduce(function(html, key) {
				let value = isNumeric(item[key])
					? abbreviateNumber(item[key])
					: item[key];
				html += "<div class='tooltip-row'>" + key + ": " + value + "</div>";
				return html;
			}, "");
		},
		bodyStyle: {
			"font-size": "16px"
		},
		footer: "",
		footerStyle: {
			"margin-top": 0
		}
	}
};

function Chart(props) {
	let config = {
		...CHARTCONFIG,
		type: props.chart.type,
		data: props.data,
		colorScale: props.chart.colorScale,
		//colorScale : props.chart.colorScale !== "" ? "colorScale" : props.chart.colorScale,
		colorScalePosition : props.chart.colorScale !== "" ? "bottom" : false,
		// title: props.title,
		// groupBy: props.groupBy
	};

	switch (config.type) {
		case "treemap":
			return <Treemap config={config} />;

		case "donut":
			return <Donut config={config} />;

		case "pie":
			return <Pie config={config} />;

		case "bubble":
			return <BarChart config={config} />;

		case "table":
			return <PanelTable data={config.data} />;

		case "bar":
			return <BarChart config={config} />;

		case "wordcloud":
			return (
				<WordCloud
					data={config.data}
					fontSizeMapper={word => Math.log2(word.value) * 5}
					//rotate={word => (Math.random() * 6 - 3) * 30}
				/>
			);

		case "stacked":
			return <StackedArea config={config} />;

		default:
			return <div />;
	}
}

function mapDataForChart(data, chart, props) {
	switch (chart.type) {
		case "treemap":
		case "donut":
		case "pie":
			return data.reduce((all, item) => {
				let value = item[props.y];
				if (isNumeric(value))
					all.push({
						id: item[props.x],
						name: item[props.x],
						year: item[props.year],
						colorScale: item[props.colorScale],
						value,
						source: item
					});
				return all;
			}, []);

		case "bar":
		case "stacked":
			return data.reduce((all, item) => {
				let value = item[props.y];
				if (isNumeric(value))
					all.push({
						id: item[props.x],
						name: item[props.x],
						x: item[props.year],
						y: value,
						source: item
					});
				return all;
			}, []);

		case "wordcloud":
			return data.reduce((all, item) => {
				let value = item[props.y];
				if (isNumeric(value))
					all.push({
						text: item[props.x],
						value,
						source: item
					});
				return all;
			}, []);

		case "table":
		default:
			return data;
	}
}

function mapGrowthToData(data) {
	const obj = prepareGrowth(data)
	return data.reduce((all, item) => {
		all.push({
			...item,
			growth: obj[item.name],
			source: {growth: obj[item.name]}
		});
		return all;
	}, []);
}

function mapStateToProps(state) {
	let aggr = state.aggregators,
		props = { x: "", y: "", year: "", colorScale: state.visuals.chart.colorScale };

	if (aggr.drilldowns.length > 1) {
		let xor = aggr.drilldowns[0].dimensionType === 0;
		props.x = aggr.drilldowns[xor ? 0 : 1].level;
		props.year = aggr.drilldowns[xor ? 1 : 0].level;
	} else if (aggr.drilldowns.length > 0) {
		props.x = aggr.drilldowns[0].level;
	}

	if (aggr.measures.length > 0) {
		props.y = aggr.measures[0].name;
	}

	if (state.cubes.current.timeDimensions.length > 0) {
		props.year = state.cubes.current.timeDimensions[0].name;
	}

	console.log(mapGrowthToData(mapDataForChart(state.data.values, state.visuals.chart, props)))

	return {
		chart: state.visuals.chart,
		data: mapGrowthToData(mapDataForChart(state.data.values, state.visuals.chart, props))
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
	};
}

export default connect(mapStateToProps)(Chart);
