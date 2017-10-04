import React from "react";
import { connect } from "react-redux";
import FileSaver from "file-saver";
import { Table, Column, Cell } from "@blueprintjs/table";

import "styles/VizTable.css";

// Dinamic selector
class VizTable extends React.Component {
	constructor(props) {
		super(props);
		//this.updateExtension = this.updateExtension.bind(this);
		//this.downloadFile = this.downloadFile.bind(this);
	}

	downloadFile(event, ext, extension) {
		let data = JSON.stringify(event);

		if (extension) {
			var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
			FileSaver.saveAs(blob, `data.json`);
		}
	}

	render() {
		const props = this.props;
		let keys = props.data[0] ? Object.keys(props.data[0]) : {};

		return (
			<div className="viz-table">
				<table className="table">
					<thead className="table-header">
						<tr className="table-row">
							{keys.map(e => {
								return <th className="table-cell">{e}</th>;
							})}
						</tr>
					</thead>
					<tbody className="table-body">
						{props.data.map(e => {
							return (
								<tr className="table-row">
									{keys.map(elm => {
										return <td className="table-cell">{e[elm]}</td>;
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		data: state.data.values
	};
}

export default connect(mapStateToProps)(VizTable);