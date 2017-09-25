import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { mean } from "d3-array";
import { COLORS_RAINFALL } from "helpers/colors";

import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";
import { groupLowestCategories } from "helpers/prepareViz";

import { calculateGrowth } from "helpers/prepareViz";

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

// ["red", "#88B0D8", "#3F51B5"]
const CHARTCONFIG = {
	//colorScaleConfig : { color: ["#D32F2F", "#FFF59D", "#388E3C"] },
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
//props.chart.colorScale
function Chart(props) {
	console.log(props.chart.colorScale)
	let data;
	if (props.axis.year) {
		let attributes = calculateGrowth(
			props.data,
			props.chart.colorScale !== "growth" ? "colorScale" : "value"
		);
		data = props.data.map(attr => ({
			...attr,
			growth: attributes[attr.id]
		}));
	} else {
		data = props.data;
	}

	let config = {
		...CHARTCONFIG,
		type: props.chart.type,
		aggs: {
			growth: mean,
			colorScale: mean
		},
		data: data,
		colorScalePosition: props.chart.colorScale !== "" ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		},
		colorScale: props.chart.colorScale !== "growth" ? "colorScale" : "growth",
		shapeConfig: {
			fontFamily: () => "Work Sans"
		},
		legendConfig: {
			marginLeft: 50,
			padding: 8,
			shapeConfig: {
				labelConfig: {
					fontColor: "rgba(0, 0, 0, 0.8)",
					fontFamily: () => "Work Sans",
					fontResize: false,
					fontSize: 12,
					fontWeight: 400
				},
				height: () => 25,
				width: () => 25
			},
			tooltipConfig: {
				body: false
			}
		}
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

function mapStateToProps(state) {
	let aggr = state.aggregators,
		props = {
			x: "",
			y: "",
			year: "",
			colorScale: state.visuals.chart.colorScale
		};

	if (aggr.drilldowns.length > 1) {
		let xor = aggr.drilldowns[0].dimensionType === 0;
		props.x = aggr.drilldowns[xor ? 0 : 1].level;
		props.year = aggr.drilldowns[xor ? 1 : 0].level;
	} else if (aggr.drilldowns.length > 0) {
		props.x = aggr.drilldowns[0].level;
	}

	if (aggr.measures.length > 0) {
		props.y = aggr.measures.filter(ms => ms.name === state.visuals.axis.y)[0].name;
	}

	if (state.cubes.current.timeDimensions.length > 0) {
		props.year = state.cubes.current.timeDimensions[0].name;
	}

	return {
		chart: state.visuals.chart,
		axis: state.visuals.axis,
		data: mapDataForChart(state.data.values, state.visuals.chart, props)
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
	};
}

export default connect(mapStateToProps)(Chart);
