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

	getCustomPanel = (panel) => {
		switch(panel) {
			case true:
				return( 
					<div className="panel">
						Custom panel options:
						<select name="" id="">
							<option value="">Test</option>
						</select>
					</div>
				);
			case false:
				return <div></div>;
		}
	}

	getAxiSelect = (data) => {
		return(
			<label htmlFor="">
				{data} Axis
				<input type="text"/>
			</label>
		)
	}

	getActiveTabComponent(activeTab, currentTab) {
		return activeTab == currentTab ? 'icon active' : 'icon';
	}

	render() {
		return (
			<div className="viz-selector-wrapper">
				<div className="title">Visualizations</div>
				<div className="icons">
					{icons.map(icon =>
						<img
							title={icon.title}
							className={this.getActiveTabComponent(this.props.config.type, icon.name)}
							src={"/images/viz/icon-" + icon.name + ".svg"}
							onClick={() => {
								this.props.handleChangeViz(icon);
							}}
						/>
					)}
				</div>
				{this.getCustomPanel(this.props.config.panel)}
			</div>
		);
	}
	
}

export default VizSelector;
