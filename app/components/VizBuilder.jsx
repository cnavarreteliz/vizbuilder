import React, { Component } from "react";
import { Treemap, Donut } from "d3plus-react";

class VizBuilder extends Component {
	constructor(props) {
		super(props);
	}

	getVizBuilderComponent(type, config) {
		switch (type) {
			case "treemap":
				return <Treemap config={config} />;

			case "donut":
				return <Donut config={config} />;
		}
	}

	render() {
		return this.getVizBuilderComponent(this.props.type, this.props.config);
	}
}

export default VizBuilder;
