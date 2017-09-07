import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import TableViz from "components/TableViz";

import "styles/PanelChart.css";

function PanelChart(props) {
	let config = {
		type: props.type,
		data: props.data,
		title: props.title,
		colorScale: "value"
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

function mapDataChart(data, panel, props) {
	switch (panel) {
		case "PANEL_TYPE_NORMAL":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				value: item[props.y]
			}));
		case "PANEL_TYPE_2D":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				y: item[props.y],
				x: item[props.year]
			}));
	}
}

function mapStateToProps(state) {
	let props = state.visuals.axis,
		panel = state.visuals.panel,
		data = applyFilters(state.data.values, state.filters);

	return {
		type: state.visuals.type,
		groupBy: state.visuals.groupBy,
		data: mapDataChart(data, panel, props)
	};
}

export default connect(mapStateToProps)(PanelChart);
