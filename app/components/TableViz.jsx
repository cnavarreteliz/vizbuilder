import React, { Component } from "react";
import FileSaver from "file-saver";
import { Table, Column, Cell } from "@blueprintjs/table";

import "styles/TableViz.css";

// Dinamic selector
class TableViz extends Component {
	constructor(props) {
		super(props);

		//this.updateExtension = this.updateExtension.bind(this);
		//this.downloadFile = this.downloadFile.bind(this);
	}

	downloadFile(event, ext, extension) {
		let data = JSON.stringify(event);
		console.log(ext);

		if (extension) {
			var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
			FileSaver.saveAs(blob, `data.json`);
		}
	}

	getCellData = (rowIndex, columnIndex, item) => {
		/*const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
        if (sortedRowIndex != null) {
            rowIndex = sortedRowIndex;
        }*/
		return item;
	};

	updateExtension(event) {
		this.setState({
			extension: event.target.value
		});
	}

	render() {
		const options = this.props;
		const numRows = options.config.data.length;

		const renderCellName = (rowIndex, columnIndex) => {
			return (
				<Cell>
					{options.config.data[rowIndex]["name"]}
				</Cell>
			);
		};

		const renderCellValue = (rowIndex, columnIndex) => {
			return (
				<Cell>
					{options.config.data[rowIndex]["value"]}
				</Cell>
			);
		};

		const renderCellYear = (rowIndex, columnIndex) => {
			return (
				<Cell>
					{options.config.data[rowIndex]["year"]}
				</Cell>
			);
		};

		return (
			<Table numRows={numRows}>
				<Column name="Name" renderCell={renderCellName} />
				<Column name="Value" renderCell={renderCellValue} />
				<Column name="Year" renderCell={renderCellYear} />
			</Table>
		);
	}
}

export default TableViz;
