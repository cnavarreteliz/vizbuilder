import React from "react";
import PropTypes from "prop-types";
import { csvFormat } from "d3-dsv";
import { saveElement } from "d3plus-export";
import { saveAs } from "file-saver";

import { Icon, Dialog, Button, Intent, Tabs2, Tab2 } from "@blueprintjs/core";
import VizTable from "components/VizTable";
import PanelInfo from "components/PanelInfo";

import "styles/Toolbar.css";
import "styles/Dialog.css";

class Toolbar extends React.Component {
	state = {
		dialogOpen: false
	};

	propTypes = {
		axis: PropTypes.shape({
			x: PropTypes.string,
			y: PropTypes.string,
			year: PropTypes.string,
		}).isRequired,
		data: PropTypes.array.isRequired,
		cube: PropTypes.string.isRequired
	};

	defaultProps = {
		axis: {
			x: "",
			y: "",
			year: ""
		},
		data: [],
		cube: ""
	};

	render() {
		let { axis, data } = this.props;

		return (
			<ul className="toolbar">
				<li className="button" onClick={this.toggleDialog}>
					<Icon iconName="pt-icon-th" /> View Data
					<Dialog
						iconName="inbox"
						isOpen={this.state.dialogOpen}
						onClose={this.toggleDialog}
						title={this.title.toUpperCase()}
					>
						<div className="pt-dialog-body">
							<Tabs2>
								<Tab2
									id="rx"
									title="About"
									panel={<PanelInfo data={data} axis={axis} />}
								/>
								<Tab2 id="ng" title="Data" panel={<VizTable data={data} />} />
							</Tabs2>
						</div>
						<div className="pt-dialog-footer">
							<div className="pt-dialog-footer-actions">
								<Button
									intent={Intent.PRIMARY}
									onClick={this.saveCSV}
									text="Download CSV"
								/>
							</div>
						</div>
					</Dialog>
				</li>
				<li className="button" onClick={this.saveImage}>
					<Icon iconName="pt-icon-media" /> Save Image
				</li>
				<li className="button" onClick={this.saveCSV}>
					<Icon iconName="pt-icon-import" /> Download CSV
				</li>
			</ul>
		);
	}

	get title() {
		return `${this.props.cube} - ${this.props.axis.x} vs ${this.props.axis.y}`;
	}

	toggleDialog = () => {
		this.setState(state => ({ dialogOpen: !state.dialogOpen }));
	};

	saveImage = () => {
		// TODO: find a better way
		// Very fragile, but right now there's no other way without reestructuring
		// Must be keep updated with the JSX in the Chart.jsx component
		const element = document.querySelector(".viz > svg");
		element &&
			saveElement(element, { filename: this.title, type: "png" });
	};

	saveCSV = () => {
		let blob = new Blob([csvFormat(this.props.data)], { type: "text/plain;charset=utf-8" });
		saveAs(blob, `${this.title}.csv`);
	};
}

export default Toolbar;
