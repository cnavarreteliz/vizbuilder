import { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@blueprintjs/core/dist/components/button/buttons.js";

import Filter, { defaultFilter } from "components/Filter";

import VizSelector from "components/VizSelector";
import YearSelector from "components/YearSelector";
import VizBuilder from "components/VizBuilder";
import Timeline from "components/Timeline";
import Assistant from "components/Assistant";

import "./App.css";

function App(props) {
	// TODO: move filters to its own component
	let filters = props.filters.map(function(filter) {
		return (
			<Filter
				key={filter._id}
				columns={props.dataColumns}
				property={filter.property}
				operator={filter.operator}
				value={filter.value}
				index={filter._id}
				onChange={props.onFilterUpdate}
				onDelete={props.onFilterRemove}
			/>
		);
	});

	return (
		<div className="container">
			<div className="side-panel">
				<VizSelector />
				{filters}
				<Button className="pt-fill" iconName="add" onClick={props.onFilterAdd}>
					Add filter
				</Button>
			</div>
			<div className="main-panel">
				<VizBuilder />
				<Timeline />
			</div>
			<div className="side-panel">
				<h2>Assistant</h2>
				Hello, I'm Liz, your data analytics assistant.
				<hr />
				<h5>Suggested searchs:</h5>
				<Assistant />
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	// TODO: get properties from state.data.values
	// TODO: reduce min and max values for ranges
	return {
		dataColumns: ["year", "value", "id", "name", "group"],
		filters: state.filters
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onDataLoad(data) {
			dispatch({ type: "DATA_UPDATE", payload: data });
		},

		onFilterAdd() {
			dispatch({ type: "FILTER_ADD", payload: defaultFilter() });
		},

		onFilterUpdate(id, props) {
			dispatch({
				type: "FILTER_UPDATE",
				payload: { ...props, _id: id }
			});
		},

		onFilterRemove(index) {
			dispatch({ type: "FILTER_DELETE", payload: index });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
