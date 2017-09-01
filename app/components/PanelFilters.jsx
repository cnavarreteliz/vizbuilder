import { connect } from "react-redux";
import { Button } from "@blueprintjs/core/dist/components/button/buttons.js";

import OPERATOR from "assets/operators";
import ChartSelector from "components/ChartSelector";
import Filter from "components/FilterItem";

function FilterArea(props) {
	if (!props.show) return null;

	let filters = props.filters.map(function(filter) {
		return (
			<Filter
				key={filter._id}
				columns={props.dataColumns}
				property={filter.property}
				operator={filter.operator}
				value={filter.value}
				min={props.ranges[filter.property].min}
				max={props.ranges[filter.property].max}
				index={filter._id}
				onChange={props.onFilterUpdate}
				onDelete={props.onFilterRemove}
			/>
		);
	});

	return (
		<div className="filters-wrapper">
			<ChartSelector />
			<div className="pt-form-group">
				<label className="pt-label">Filters</label>
				<div className="filter-items">{filters}</div>
				<Button
					className="pt-fill"
					iconName="add"
					onClick={() => props.onFilterAdd(props.defaultFilter)}
				>
					Add filter
				</Button>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	let measures = state.aggregators.measures.reduce((obj, measure) => {
		measure = measure.name;
		obj[measure] = state.data.values.reduce(
			(output, item) => {
				output.min = Math.min(output.min, item[measure] * 1);
				output.max = Math.max(output.max, item[measure] * 1);
				return output;
			},
			{ min: Number.MAX_VALUE, max: Number.MIN_VALUE }
		);
		return obj;
	}, {});

	console.log(measures)

	return {
		show: state.data.values.length > 0,
		dataColumns: state.aggregators.measures.map(measure => measure.name),
		filters: state.filters,
		defaultFilter: {
			property: Object.keys(measures)[0],
			operator: OPERATOR.HIGHEREQUAL,
			value: 0
		},
		ranges: measures
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onFilterAdd(filter) {
			dispatch({
				type: "FILTER_ADD",
				payload: filter
			});
		},

		onFilterUpdate(id, props) {
			dispatch({
				type: "FILTER_UPDATE",
				payload: { ...props, _id: id }
			});
		},

		onFilterRemove(id) {
			dispatch({ type: "FILTER_DELETE", payload: id });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterArea);
