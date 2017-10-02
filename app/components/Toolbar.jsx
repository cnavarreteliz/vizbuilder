import React from "react";
import { connect } from "react-redux";
import { text, json } from "d3-request";
import { saveElement } from "d3plus-export";
import { saveAs } from "file-saver";
import { Icon } from "@blueprintjs/core";
import { csvFormat } from "d3-dsv";

import "styles/Toolbar.css";

class Toolbar extends React.Component {
	
	onCSV() {
		const { title, data } = this.props;
		saveAs(
			new Blob([ csvFormat(data) ], { type: "text/plain;charset=utf-8" }),
			`${title}.csv`
		);
	}

	onImage() {
		const { component, title } = this.props;
		if (component.viz) {
			const elem =
				component.viz.container ||
				component.viz._reactInternalInstance._renderedComponent._hostNode;
			saveElement(elem, { filename: title, type: "png" });
		}
	}

	onBlur() {
		this.input.blur();
	}

	onFocus() {
		this.input.select();
	}

	render() {
		let { url, data, title } = this.props;
		let onCSV = this.onCSV;

		if (url && !url.includes(API)) url = `${API}${url.slice(1)}`;
		url = url ? url.replace("aggregate.csv", "aggregate.jsonrecords") : url;

		return (
			<ul className="toolbar">
				<li className="button">
					<Icon iconName="pt-icon-th" /> View Data
				</li>
				<li className="button" onClick={this.onImage.bind(this)}>
					<Icon iconName="pt-icon-media" /> Save Image
				</li>
				<li className="button" onClick={this.onCSV.bind(this)}>
					<Icon iconName="pt-icon-import" /> Download CSV
				</li>
			</ul>
		);
	}
}

function mapStateToProps(state) {
	return {
		show: state.data.values.length > 1,
		data: state.data.values,
		title: state.visuals.axis.x
	};
}

export default connect(mapStateToProps)(Toolbar);
