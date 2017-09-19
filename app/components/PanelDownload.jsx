import { Icon } from "@blueprintjs/core";
import { connect } from "react-redux";

import React, {Component} from "react";
import {saveAs} from "file-saver";
import {text} from "d3-request";
import {saveElement} from "d3plus-export";

import "styles/PanelDownload.css";

class PanelDownload extends Component {
	onCSV(data, title) {
        console.log(data)
        saveAs(
            new Blob([data], { type: "text/plain;charset=utf-8" }),
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
        const props = this.props;
        const { onCSV } = props;        
        
        let {url} = this.props;
        if (url && !url.includes(API)) url = `${API}${url.slice(1)}`;
        url = url ? url.replace("aggregate.csv", "aggregate.jsonrecords") : url;

		return (
			<div className="paneldownload-options">
				<a className="download-btn">
					<Icon iconName="pt-icon-th" /> View Data
				</a>
				<a className="download-btn">
					<Icon iconName="pt-icon-media" /> Save Image
				</a>
				<a
					className="download-btn"
					onClick={evt =>
						this.onCSV( props.data , props.title )}
				>
					<Icon iconName="pt-icon-import" /> Download CSV
				</a>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		show: state.data.values.length > 1,
        data: state.data.values,
        title: "download"
	};
}

export default connect(mapStateToProps)(PanelDownload);