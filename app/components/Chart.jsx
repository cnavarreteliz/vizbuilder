import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { mean } from "d3-array";

import { COLORS_RAINFALL } from "helpers/colors";
import { CHARTCONFIG } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { isNumeric } from "helpers/functions";
import { groupLowestCategories, calculateGrowth } from "helpers/prepareViz";

import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";

import "styles/Chart.css";

function Chart(props) {
	// Create buckets if drilldown selected is Age
	let data =
		props.axis.x === "Age"
			? createBuckets(props.data, props.num_buckets)
			: props.data;

	if (props.axis.year) {
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

	//data = groupLowestCategories(data)

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

	let config = {
		...CHARTCONFIG,
		type: props.chart.type,
		aggs: {
			growth: mean,
			colorScale: mean
		},
		data: data,
		colorScale: colorScale,
		colorScalePosition:
			props.chart.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		}
	};

	switch (config.type) {
		case "treemap":
			if(props.groupBy.name) {
				config = {
					...config,
					groupBy: ["groupBy", "id"]
				}
			}
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
						year: item[props.year],
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
			colorScale: colorBy.name || '',
			groupBy: groupBy.name || ''
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

	let chart = {...state.visuals.chart, colorScale: props.colorScale };

	return {
		chart: chart,
		groupBy: groupBy,
		axis: state.visuals.axis,
		data: mapDataForChart(state.data.values, chart, props),
		num_buckets: state.visuals.buckets
		// data: groupLowestCategories(mapDataChart(data, chart, props)),
		// data: mapDataChart(data, chart, props),
	};
}

export default connect(mapStateToProps)(Chart);
