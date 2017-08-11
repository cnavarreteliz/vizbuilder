import React, { Component } from "react";
import FileSaver from "file-saver";
import './Table.css';

// Dinamic selector
class Table extends Component {
	constructor(props) {
		super(props);

        //this.updateExtension = this.updateExtension.bind(this);
		//this.downloadFile = this.downloadFile.bind(this);
	}

	downloadFile(event, ext, extension) {
		let data = JSON.stringify(event)
		console.log(ext)
		
        if (extension) {
            var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(blob, `data.json`);
        }
    }
    
    updateExtension(event) {
        this.setState({
            extension: event.target.value
        })
    }

	render() {
		const options = this.props;
		return (
			<div className="viz">
				<div className="download">
					Download data as
					<select id="">
						<option value="json">JSON</option>
					</select>
					<button
						onClick={this.downloadFile.bind(
							this,
							options.config.data,
							'json'
						)}
					>
						<i className="fa fa-download" />
					</button>
				</div>
				<table className="table">
					<thead>
						<tr>
							<th>#</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{options.config.data.map(row =>
							<tr>
								<td>{row.id}</td>
								<td>{row.value}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Table;
