import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { prepareHierarchy } from "helpers/prepareHierarchy";
import { prepareNaturalInput } from "helpers/prepareNaturalInput";

import "react-select/dist/react-select.css";
import "styles/ChartSelector.css";

function ChartSelector(props) {
	let { onSearchChange } = props;
	return (
		<div className="chartoptions-wrapper">
			<div>
				<div className="title">Show me</div>
				<Select
					options={props.ninput}
					placeholder="ex. Industry Group, Sector, Education Sponsored"
					onChange={onSearchChange}
				/>
			</div>
		</div>
	);
}

function SmartSelector(props) {
	return (
		<label className="pt-label pt-inline">
			{props.name}
			<div className="pt-select">
				<select onChange={props.onChange}>
					<option>Select...</option>
					{props.options.map(item => (
						<option value={item.dimension}>{item.name}</option>
					))}
				</select>
			</div>
		</label>
	);
}

// Detect Time Dimension in Series
function timeDimensions(data) {
	return data.filter(e => e.dimensionType == 1).map(e => e.name);
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		ninput: prepareNaturalInput(state.cubes.all),

		x: {
			labels: state.aggregators.drilldowns.map(e => e.name),
			value: state.visuals.axis.x
		},

		y: {
			labels: state.aggregators.measures.map(e => e.name),
			value: state.visuals.axis.y
		},

		year: {
			labels: timeDimensions(state.cubes.current.dimensions),
			value: state.visuals.axis.year
		}
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		},

		onSearchChange(data) {
			dispatch({ type: "CUBES_SET", payload: data.options.cube });
			dispatch({
				type: "DATA_SET",
				payload: {
					measure: data.options.measure,
					dimension: data.options.dimension
				}
			});
			dispatch({ type: "VIZ_COLOR_UPDATE", payload: "" });
			dispatch({
				type: "VIZ_FULL_UPDATE",
				dimension: data.options.dimension.name,
				measure: data.options.measure.name
			});
			
			// Always add timeDimension drilldown if isset in cube
			prepareHierarchy(data.options.timeDimensions).map(dim => {
				if (dim._children.length == 0) { 
					dispatch({ type: "DRILLDOWN_ADD", payload: dim });
				}
				else { 
					prepareHierarchy(dim._children).map(e => {
						dispatch({ type: "DRILLDOWN_ADD", payload: e });
					})
				}
				
			});


		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
