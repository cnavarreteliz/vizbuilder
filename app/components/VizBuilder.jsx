import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart } from "d3plus-react";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/Filter";
import Table from "components/Table";

import "./VizBuilder.css";

function VizBuilder(props) {
	let config = {
		...props.viz,
		data: props.data,
		title: props.title,
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
			return <Table config={config} />;

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
		viz: state.data.viz,
		data: applyFilters(state.data.rawData, state.filters),
		measure: state.measure
	};
}

export default connect(mapStateToProps)(VizBuilder);
