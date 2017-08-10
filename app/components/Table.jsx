import React, { Component } from "react";
import FileSaver from "file-saver";

// Dinamic selector
class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			extension: 'json'
		};

        //this.updateExtension = this.updateExtension.bind(this);
		//this.downloadFile = this.downloadFile.bind(this);
	}

	downloadFile(data, extension) {
        if (extension) {
            var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(blob, `data.${extension}`);
        }
    }
    
    updateExtension(event) {
        console.log(event.target.value)
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
						onClick={this.downloadFile(
							options.config.data,
							'json'
						)}
					>
						<i className="fa fa-download" />
					</button>
				</div>
				<table>
					<tr>
						<th>#</th>
						<th>Value</th>
					</tr>
					{options.config.data.map(row =>
						<tr>
							<td>
								{row.id}
							</td>
							<td>
								{row.value}
							</td>
						</tr>
					)}
				</table>
			</div>
		);
	}
}

export default Table;
