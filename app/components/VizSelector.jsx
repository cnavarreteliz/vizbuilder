import React, { Component } from "react";

import VizSelectorPanel from "components/VizSelectorPanel";

import icons from "data/visual-options.json";
import "./VizSelector.css";

class VizSelector extends Component {
	getActiveTabComponent(activeTab, currentTab) {
		return activeTab == currentTab ? "icon active" : "icon";
	}

	renderPanelOptions(props) {
		if (props.config.panel) {
			return (
				<div className="panel-options">
					<p className="title">Options</p>
					<VizSelectorPanel
						label="Cube"
						onChange={props.handleChangeCube}
						options={props.cube_options}
						value={props.cubeName}
					/>
					<VizSelectorPanel
						label="Dimension"
						onChange={props.handleChangeAxis}
						options={props.axis}
						value={props.dimension}
					/>
					<VizSelectorPanel
						label="Measure"
						onChange={props.handleChangeMeasure}
						options={props.size_options}
						value={props.size}
					/>
				</div>
			);
		}
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
				{this.renderPanelOptions(this.props)}
			</div>
		);
	}
}

export default VizSelector;
