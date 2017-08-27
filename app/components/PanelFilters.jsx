import { connect } from "react-redux";
import { Button } from "@blueprintjs/core/dist/components/button/buttons.js";

import Filter, { defaultFilter } from "components/FilterItem";

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
				min={props.ranges.min}
				max={props.ranges.max}
				index={filter._id}
				onChange={props.onFilterUpdate}
				onDelete={props.onFilterRemove}
			/>
		);
	});

	return (
		<div className="filters-wrapper">
			<div className="pt-form-group">
				<label className="pt-label">Filters</label>
				<div className="filter-items">
					{filters}
				</div>
				<Button className="pt-fill" iconName="add" onClick={props.onFilterAdd}>
					Add filter
				</Button>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		show: state.data.values.length > 0,
		dataColumns: Object.keys(state.data.values[0] || {}),
		filters: state.filters,
		ranges: state.data.values.reduce(
			(output, item) => {
				output.min = Math.min(output.min, item.value);
				output.max = Math.max(output.max, item.value);
				return output;
			},
			{ min: Number.MAX_VALUE, max: Number.MIN_VALUE }
		)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onFilterAdd() {
			dispatch({ type: "FILTER_ADD", payload: defaultFilter() });
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
