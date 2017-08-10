import React, { Component } from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";
import "./VizSelector.css";

class VizSelector extends Component {
	handleChange(event) {
		var option = event.target.value;
		var event = "donut";
		console.log(event);
		this.props.handleChangeViz(event);
	}

	getCustomPanel = (props) => {
		switch (props.config.panel) {
			case true:
				return (
					<div className="panel">
						<label>Axis:</label>
						<select value={props.source} onChange={props.handleChangeAxis}>
							{props.axis.map(filter =>
								<option
									value={filter}
								>
									{filter}
								</option>
							)}
						</select>
						<label>Size:</label>
						<select value={props.size} onChange={props.handleChangeSize}>
							{props.size_items.map(filter =>
								<option
									value={filter}
								>
									{filter}
								</option>
							)}
						</select>
					</div>
				);
			case false:
				return (
					<div className="panel">
						<label>X Axis</label>
						<select name="" id=""><option></option></select>
						<label>Y Axis</label>
						<select name="" id=""><option></option></select>
					</div>
				);
		}
	};

	getAxiSelect = data => {
		return (
			<label htmlFor="">
				{data} Axis
				<input type="text" />
			</label>
		);
	};

	getActiveTabComponent(activeTab, currentTab) {
		return activeTab == currentTab ? "icon active" : "icon";
	}

	render() {
		return (
			<div className="viz-selector-wrapper">
				<div className="title">Visualizations</div>
				<div className="icons">
					{icons.map(icon =>
						<img
							title={icon.title}
							className={this.getActiveTabComponent(
								this.props.config.type,
								icon.name
							)}
							src={"/images/viz/icon-" + icon.name + ".svg"}
							onClick={() => {
								this.props.handleChangeViz(icon);
							}}
						/>
					)}
				</div>
				<div className="panel-options">
				<div>Options</div>
				{this.getCustomPanel(this.props)}
				</div>
			</div>
		);
	}
}

export default VizSelector;
