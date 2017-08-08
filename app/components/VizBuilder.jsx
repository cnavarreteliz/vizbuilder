import React, { Component } from "react";
import { Treemap, Donut, Pie, BarChart } from "d3plus-react";

class VizBuilder extends Component {
	constructor(props) {
		super(props);
	}

	getVizBuilderComponent(type, config) {
		console.log(config)
		switch (type) {
			case "treemap":
				return <Treemap config={config} />;

			case "donut":
				return <Donut config={config} />;

			case "pie":
				return <Pie config={config} />;

			case "bubble":
				return <BarChart config={config} />;
		}
	}

	render() {
		const options = this.props
		return this.getVizBuilderComponent(options.type, options.config);
	}
}

export default VizBuilder;
