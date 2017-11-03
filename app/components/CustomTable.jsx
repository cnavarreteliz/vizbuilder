import React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";

class CustomTable extends React.Component {
	render() {
		let data = this.props.data;
		let keys = Object.keys(data[0] || {});

		let columns = Object.keys(data[0] || {}).map((item) => {
			return {
				Header: item,
    			accessor: item
			}
		})
		return <ReactTable data={data} columns={columns} />;
	}
}

export default CustomTable;
