import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { max, mean, min, sum } from "d3-array";

import { COLORS_RAINFALL } from "helpers/colors";
import { TREEMAPCONFIG, CHARTCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { isNumeric } from "helpers/functions";
import { groupLowestCategories, calculateGrowth } from "helpers/prepareViz";
import { prepareSupercube } from "helpers/prepareInput";

import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import VizTable from "components/VizTable";

import "styles/Chart.css";

function Chart(props) {

	// Create buckets if drilldown selected is Age
	let data =
		props.axis.x === "Age"
			? createBuckets(props.data, props.num_buckets)
			: props.data;

	if (props.growthType) {
		let attributes = calculateGrowth(
			data,
			props.chart.colorScale !== "" ? "colorScale" : "value"
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

	console.log(data)

	data = groupLowestCategories(data);

	let max = Math.max(...data.map(d => d.year)),
		min = Math.min(...data.map(d => d.year))

	let colorScale;
	if (props.chart.colorScale === "" && props.chart.growth) {
		colorScale = "growth";
	} else if (props.chart.colorScale === "" && !props.chart.growth) {
		colorScale = false;
	} else if (props.chart.colorScale !== "" && props.chart.growth) {
		colorScale = "growth";
	} else {
		colorScale = "colorScale";
	}

	console.log(data)

	let config = {
		...CHARTCONFIG,
		type: props.chart.type,
		//controls: yearControls(data),
		aggs: {
			growth: mean,
			colorScale: mean,
			value: measureType(props.axis.y) ? mean : sum
		},
		data: data,
		domain: min < 0 ? [min, 0, max] : [min, max],
		colorScale: colorScale,
		colorScalePosition:
			props.chart.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		}
		
	};

	switch (config.type) {
		case "treemap":
			if (props.groupBy.name) {
				config = {
					...config,
					groupBy: ["groupBy", "id"]
				};
			}
			return <Treemap config={{...TREEMAPCONFIG, ...config}} />;

		case "donut":
			return <Donut config={config} />;

		case "pie":
			return <Pie config={config} />;

		case "bubble":
			return <BarChart config={config} />;

		case "table":
			return <VizTable data={config.data} />;

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

function measureType(measure) {
	let measureFilter = RegExp("growth|average|median|percent|avg|gini|rca", "i")
	return measureFilter.test(measure)
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
						year: parseInt(item[props.year] || item.Year),
						groupBy: item[props.groupBy],
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
						year: parseInt(item[props.year] || item.Year),
						colorScale: item[props.colorScale],
						x: item[props.id],
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
		colorBy = aggr.colorBy[0] || {},
		groupBy = aggr.groupBy[0] || {},
		props = {
			x: "",
			y: "",
			year: "",
			colorScale: colorBy.name || "",
			groupBy: groupBy.level || ""
		};

	if (aggr.drilldowns.length > 1) {
		let xor = aggr.drilldowns[0].dimensionType === 0;
		props.x = aggr.drilldowns[xor ? 0 : 1].level;
		props.year = aggr.drilldowns[xor ? 1 : 0].level;
	} else if (aggr.drilldowns.length > 0) {
		props.x = aggr.drilldowns[0].level;
	}

	if (aggr.measures.length > 0) {
		props.y = aggr.measures.filter(
			ms => ms.name === state.visuals.axis.y
		)[0].name;
	}

	if (state.cubes.current.timeDimensions.length > 0) {
		props.year = state.cubes.current.timeDimensions[0].name;
	}

	let chart = { ...state.visuals.chart, colorScale: props.colorScale };

	return {
		supercube: state.cubes.all,
		chart: chart,
		growthType: state.visuals.chart.growth,
		groupBy: groupBy,
		axis: state.visuals.axis,
		data: mapDataForChart(state.data.values, chart, props),
		num_buckets: state.visuals.buckets
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
	};
}

export default connect(mapStateToProps)(Chart);
