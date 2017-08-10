import React, { Component } from "react";
import { Treemap, Donut, Pie, BarChart } from "d3plus-react";
import Table from "components/Table"
import './VizBuilder.css'

class VizBuilder extends Component {

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
		}
	}

	render() {
		const options = this.props
		return(
			<div>
				{this.getVizBuilderComponent(options.type, options.config)}
			</div>
		); 
	}
}

export default VizBuilder;
