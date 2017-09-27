import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { mean } from "d3-array";

import { COLORS_RAINFALL } from "helpers/colors";
import { CHARTCONFIG } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { groupLowestCategories, calculateGrowth } from "helpers/prepareViz";

import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";


import "styles/Chart.css";

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function Chart(props) {
	// Create buckets if drilldown selected is Age
	let data = props.axis.x === "Age" ? createBuckets(props.data, props.num_buckets) : props.data
	if (props.axis.x === "Age") { props.chart.type = "bar" }

	if (props.axis.year) {
		if (props.chart.colorScale !== "colorScale") {

		}
		let attributes = calculateGrowth(
			data,
			props.chart.colorScale === "colorScale" ? "colorScale" : "value"
		);
		
		data = data.map(attr => ({
			...attr,
			growth: attributes[attr.id],
			source: {
				...attr.source,
				Growth: attributes[attr.id]
			} 
		}));
	}

	//data = groupLowestCategories(data)

	let config = {
		...CHARTCONFIG,
		xSort: (d) => d.id,
		type: props.chart.type,
		aggs: {
			growth: mean,
			colorScale: mean
		},
		data: data,
		colorScale: props.chart.colorScale !== "growth" ? "colorScale" : "growth",
		colorScalePosition: props.chart.colorScale !== "" ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		},
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
						year: item[props.year],
						colorScale: item[props.colorScale],
						x: item[props.year],
						y: value,
						value,
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
		data: mapDataForChart(state.data.values, state.visuals.chart, props),
		num_buckets: state.visuals.buckets
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
	};
}

export default connect(mapStateToProps)(Chart);
