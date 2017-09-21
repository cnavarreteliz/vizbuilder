import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";
import { groupLowestCategories } from "helpers/prepareViz";

import "styles/Chart.css";

function prepareTooltip(obj) {
	let content = "", value
	Object.keys(obj).map(key => {
			value = isNumeric(obj[key]) ? abbreviateNumber(obj[key]) : obj[key],
			content += "<div class='tooltip-row'>" + key + ": " + value + "</div>"
		}
	)
	return content
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function abbreviateNumber(num, fixed=0) {
	if (num === null) { return null; } // terminate early
	if (num === 0) { return '0'; } // terminate early
	fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
	var b = (num).toPrecision(2).split("e"), // get power
		k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
		c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
		d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
		e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
	return e;
}

function Chart(props) {

	let config = {
		type: props.chart.type,
		data: props.data,
		// title: props.title,
		colorScale: props.chart.colorScale != "" ? "colorScale" : false,
		colorScaleConfig: { color: ["#88B0D8", "#3F51B5"] },
		colorScalePosition: props.chart.colorScale != "" ? "bottom" : false,
		shapeConfig: { fontFamily: "Fira Sans Condensed" },
		tooltipConfig: {
			background: "white",
			body: d => prepareTooltip(d.detail),
			footer: "",
			width: "200px",
			footerStyle: {
				"margin-top": 0
			},
			bodyStyle: {
				"font-size": "16px"
			},
			titleStyle: {
				"font-size": "18px",
				"text-transform": "uppercase",
				"font-weight": "bold",
				"font-family": "'Pathway Gothic One', sans-serif",
				"margin-bottom": "12px"
			},
			//body: d => prepareTooltip( d.detail ),
			padding: "10px",
			title: d => d.name
		}
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
			return <PanelTable data={props.bulk} />;

		case "bar":
			return <BarChart config={config} />;

		case "wordcloud":
			config.data = config.data.map(obj => ({
				text: obj.id,
				value: obj.value
			}));

			const fontSizeMapper = word => Math.log2(word.value) * 5;
			const rotate = word => (Math.random() * 6 - 3) * 30;

			return (
				<WordCloud
					data={config.data}
					fontSizeMapper={fontSizeMapper}
					//rotate={rotate}
				/>
			);
		case "stacked":
			return <StackedArea config={config} />;

		default:
			return <div />;
	}
}

function mapDataChart(data, chart, props) {
	switch (chart.type) {
		case "treemap":
		case "donut": 
		case "pie":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				value: item[props.y],
				colorScale: item[chart.colorScale]
			}));
		case "bar": 
		case "stacked":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				y: item[props.y],
				x: item[props.x],
				colorScale: item[chart.colorScale],
				detail: item
			}));
	}
}

function mapStateToProps(state) {
	let aggr = state.aggregators,
		props = { x: "", y: "", year: "" };

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

	return {
		chart: state.visuals.chart,
		data: mapDataChart(state.data.values, state.visuals.chart, props),
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
		// bulk: state.data.values
	};
}

export default connect(mapStateToProps)(Chart);