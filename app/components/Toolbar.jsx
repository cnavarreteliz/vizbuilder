import React from "react";
import { connect } from "react-redux";
import { text, json } from "d3-request";
import { saveElement } from "d3plus-export";
import { saveAs } from "file-saver";
import { Icon, Dialog } from "@blueprintjs/core";
import { csvFormat } from "d3-dsv";

import "styles/Toolbar.css";
function onView(props) {
	const { toggleDialog } = props;
	return (
		<div>
			<Dialog
				iconName="inbox"
				isOpen={props.isOpen}
				title="Dialog header"
			>
				<div className="pt-dialog-body">Some content</div>
				<div className="pt-dialog-footer">
					<div className="pt-dialog-footer-actions">You say yes, I say no</div>
				</div>
			</Dialog>
		</div>
	);
}

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
	let { url, data, title } = props;
	let onCSV = props.onCSV;

	return (
		<ul className="toolbar">
			<li className="button" onClick={onView}>
				<Icon iconName="pt-icon-th" /> View Data
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
		isOpen: state.data.values.length > 1 ? true : false
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleDialog(item) {}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
