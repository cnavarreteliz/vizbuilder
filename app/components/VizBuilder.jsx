import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart } from "d3plus-react";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/Filter";
import TableViz from "components/TableViz";

import "./VizBuilder.css";

function VizBuilder(props) {
	let config = {
		type: props.type,
		data: props.data,
		title: props.title,
		groupBy: props.groupBy,
		size: props.measure
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

		case "wordcloud":
			config.data = config.data.map(obj => ({
				text: obj.id,
				value: obj.value
			}));

			const fontSizeMapper = word => Math.log2(word.value) * 5;
			const rotate = word => (Math.random() * 6 - 3) * 30;

			return (
				<WordCloud
					data={data}
					fontSizeMapper={fontSizeMapper}
					//rotate={rotate}
				/>
			);

		default:
			return <div />;
	}
}

function mapStateToProps(state) {
	return {
		type: state.visuals.type,
		groupBy: state.visuals.groupBy,
		data: applyFilters(state.data.values, state.filters),
		measure: state.measure
	};
}

export default connect(mapStateToProps)(VizBuilder);
