import React from "react";
import VizTable from "components/VizTable";
import PanelInfo from "components/PanelInfo";

import { connect } from "react-redux";
import { text, json } from "d3-request";
import { saveElement } from "d3plus-export";
import { saveAs } from "file-saver";
import { Icon, Dialog, Button, Intent, Tabs2, Tab2 } from "@blueprintjs/core";
import { csvFormat } from "d3-dsv";

import "styles/Toolbar.css";
import "styles/Dialog.css";

function onCSV() {
	const { title, data } = this.props;
	saveAs(
		new Blob([csvFormat(data)], { type: "text/plain;charset=utf-8" }),
		`${title}.csv`
	);
}

function onImage() {
	const { component, title } = this.props;
	/*if (component.viz) {
			const elem =
				component.viz.container ||
				component.viz._reactInternalInstance._renderedComponent._hostNode;
			saveElement(elem, { filename: title, type: "png" });
		}*/
}

function onBlur() {
	this.input.blur();
}

function onFocus() {
	this.input.select();
}

function Toolbar(props) {
	let { data, title, toggleDialog } = props;
	let onCSV = props.onCSV;

	return (
		<ul className="toolbar">
			<li className="button" onClick={evt => props.toggleDialog(props.isOpen)}>
				<Icon iconName="pt-icon-th" /> View Data
				<Dialog
					iconName="inbox"
					isOpen={props.isOpen}
					onClose={toggleDialog}
					title={props.title}
				>
					<div className="pt-dialog-body">
						<Tabs2>
							<Tab2 id="rx" title="About" panel={<PanelInfo data={props.data} axis={props.axis} />} />
							<Tab2 id="ng" title="Data" panel={<VizTable />} />
						</Tabs2>
					</div>
					<div className="pt-dialog-footer">
						<div className="pt-dialog-footer-actions">
							<Button
								intent={Intent.PRIMARY}
								onClick={onCSV}
								text="Download CSV"
							/>
						</div>
					</div>
				</Dialog>
			</li>
			<li className="button" onClick={onImage}>
				<Icon iconName="pt-icon-media" /> Save Image
			</li>
			<li className="button" onClick={onCSV}>
				<Icon iconName="pt-icon-import" /> Download CSV
			</li>
		</ul>
	);
}

function mapStateToProps(state) {
	return {
		show: state.data.values.length > 1,
		data: state.data.values,
		title: state.visuals.axis.x,
		isOpen: state.visuals.dialogPanel.show,
		axis: state.visuals.axis
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleDialog(item) {
			console.log(item);
			dispatch({ type: "VIZ_DIALOG_TOGGLE", payload: !item });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
