import React, { Component } from "react";
import { render } from "react-dom";
import WordCloud from "react-d3-cloud";
import { Treemap, Donut, Pie, BarChart } from "d3plus-react";
import Table from "components/Table";
import "./VizBuilder.css";

class VizBuilder extends Component {
	customRenderer = (tag, size) => {
		console.log(tag);
		return (
			<span count={tag.value} value={tag.id} className={`tag-${tag.value}`}>
				{tag.id}
			</span>
		);
	};

	getVizBuilderComponent(type, config) {
		switch (type) {
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
				var data = config.data.map(obj => {
				return {
					text: obj.id,
					value: obj.value
				}
			})

				const fontSizeMapper = word => Math.log2(word.value) * 5;
				const rotate = word => ((Math.random() * 6) - 3) * 30;
				console.log(data);

				return (
					<WordCloud
						data={data}
						fontSizeMapper={fontSizeMapper}
						//rotate={rotate}
					/>
				);
		}
	}

	render() {
		const options = this.props;
		return (
			<div>
				{this.getVizBuilderComponent(options.type, options.config)}
			</div>
		);
	}
}

export default VizBuilder;
