import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import TableViz from "components/TableViz";

import "styles/PanelChart.css";

function PanelChart(props) {
	let config = {
		type: props.chart.type,
		data: props.data,
		title: props.title,
		colorScale: "colorScale",
		colorScaleConfig: {color: ["#88B0D8", "#3F51B5"] }
		
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
			return <TableViz config={config} />;

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
	switch (chart.panel) {
		case "PANEL_TYPE_NORMAL":
		console.log(data)
			return data.map(item => (
				{
				id: item[props.x],
				name: item[props.x],
				value: item[props.y],
				colorScale: item[chart.colorScale]
			}));
		case "PANEL_TYPE_2D":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				y: item[props.y],
				x: item[props.year],
				colorScale: item[chart.colorScale]
			}));
	}
}

function mapStateToProps(state) {
	let props = state.visuals.axis,
		chart = state.visuals.chart,
		data = applyFilters(state.data.values, state.filters);

	return {
		chart: chart,
		data: mapDataChart(data, chart, props)
	};
}

export default connect(mapStateToProps)(PanelChart);
