import React from "react";
import ReactTable from "react-table";
import { connect } from "react-redux";

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
	
	return <ReactTable 
		data={data} columns={columns}

		// Callbacks
		onSortedChange={(newSorted, column, shiftKey) => {
			console.log(newSorted)
			console.log(column)
			console.log(shiftKey)
		}}
	/>;
}

function mapStateToProps(state) {
	return {
		//sorted: state.charts.sorted
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onSortedUpdate(newSorted) {
			dispatch({ type: "CHART_TABLE_SET_SORTED", payload: newSorted });
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);