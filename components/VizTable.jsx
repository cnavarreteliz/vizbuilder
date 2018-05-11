import React from "react";

import "styles/VizTable.css";

function VizTable(props) {
	let { data } = props;
	let keys = Object.keys(data[0] || {});

	return (
		<div className="viz-table">
			<table className="table">
				<thead className="table-header">
					<tr className="table-row">
						{keys.map(e => <th className="table-cell">{e}</th>)}
					</tr>
				</thead>
				<tbody className="table-body">
					{data.map(e => (
						<tr className="table-row">
							{keys.map(elm => <td className="table-cell">{e[elm]}</td>)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default VizTable;
