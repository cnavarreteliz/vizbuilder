import React, { Component } from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";
import "./style.css";

class VizSelector extends Component {
	handleChange(event) {
		var option = event.target.value;
		var event = "donut";
		console.log(event);
		this.props.handleChange(event);
	}

	render() {
		return (
			<div className="viz-selector-wrapper">
				<div className="title">Visualizations</div>
				<div className="icons">
					{icons.map(icon =>
						<img
							className="icon"
							src={"/images/viz/icon-" + icon.name + ".svg"}
							onClick={() => {
								this.props.handleChange(icon.name);
							}}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default VizSelector;
