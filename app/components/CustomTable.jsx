import React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";

function CustomTable(props) {
	let data = props.data;
	// I don't know why always in the first object there is a "value" key with NaN
	delete data[0].value;	

	let columns = Object.keys(data[0] || {}).map(item => {
		return {
			Header: item,
			accessor: item
		};
	});
	
	return <ReactTable data={data} columns={columns} />;
}

export default CustomTable;
