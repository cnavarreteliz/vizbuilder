import React from "react";
import { connect } from "react-redux";

import { makeRandomId } from "helpers/random";
import { requestMembers } from "actions/datasource";

import { Button } from "@blueprintjs/core";
import FilterItem from "components/FilterItem";

import "styles/FilterManager.css";

function FilterManager(props) {
	let {
		filters,
		members,
		properties,
		addFilter,
		updateFilter,
		removeFilter,
		requestMembers
	} = props;

	return (
		<div className="group filter-manager">
			<span className="label">filtered by</span>
			<div className="filter-items">
				{filters.map(filter => (
					<FilterItem
						key={filter.key}
						filter={filter}
						members={members}
						properties={properties}
						onEdit={updateFilter}
						onRemove={removeFilter}
						onLevelSelected={requestMembers}
					/>
				))}
			</div>
			<Button text="Add filter" className="pt-fill" iconName="insert" onClick={addFilter} />
		</div>
	);
}

/** @param {VizbuilderState} state */
function mapStateToProps(state) {
	let cube = state.cubes.current;

	return {
		filters: state.filters,
		members: state.members,
		properties: [].concat(cube.measures, cube.levels)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addFilter() {
			let filter = {
				key: makeRandomId(),
				property: null,
				operator: 1,
				value: undefined
			};

			dispatch({ type: "FILTER_ADD", payload: filter });
		},

		updateFilter(filter) {
			dispatch({ type: "FILTER_UPDATE", payload: filter });
		},

		removeFilter(filter) {
			dispatch({ type: "FILTER_DELETE", payload: filter });
		},

		requestMembers(level) {
			dispatch(requestMembers(level));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterManager);
