import React from "react";
import { connect } from "react-redux";
import {
	Button,
	Menu,
	MenuItem,
	Popover,
	Position,
	Switch,
	Tag
} from "@blueprintjs/core";

import { requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";
import { prepareHierarchy } from "helpers/prepareHierarchy";
import InputSelect from "components/InputSelect";
import InputSelectPopover from "components/InputSelectPopover";
import PanelFilters from "components/PanelFilters";

import "styles/PanelAggregators.css";

class PanelAggregators extends React.Component {
	render() {
		const props = this.props;

		return (
			<div className="aggregators-wrapper">
				{
					<InputSelect
						title="Dataset"
						options={props.cubes.map(cube => ({ label: cube.name }))}
						value={props.cube.name}
						onChange={evt => props.onCubeSet(evt.target.value)}
					/>
				}
				{this.renderDrilldownSelector(props)}
				{this.renderCutSelector(props)}
				{this.renderMeasureSelector(props)}
			</div>
		);
	}

	renderDrilldownSelector(props) {
		let cube = props.cube,
			onDrilldownDelete = props.onDrilldownDelete;

		if (!cube.dimensions) return null;

		let menu = prepareHierarchy(cube.dimensions);

		let applied = props.drilldowns.map(dd => (
			<Tag key={dd.key} onRemove={() => onDrilldownDelete(dd)}>
				{dd.name}
			</Tag>
		));

		return (
			<InputSelectPopover
				label="Serie"
				menu={menu}
				active={applied}
				onClick={props.onDrilldownAdd}
			/>
		);
	}

	renderCutSelector(props) {
		let { cube, cuts, onCutAdd, onCutDelete } = props;

		if (!cube.dimensions) return null;

		let menu = prepareHierarchy(cube.dimensions);

		let applied = Object.keys(cuts)
			.map(key => cuts[key])
			.map(cut => (
				<Popover content={"ASDF"} position={Position.LEFT_TOP}>
					<Tag
						key={cut.dim.fullName}
						onRemove={() => onCutDelete(cut.dim.fullName)}
					>
						{cut.dim.hierarchy.dimension.name == cut.dim.name ? (
							cut.dim.name
						) : (
							cut.dim.hierarchy.dimension.name + " / " + cut.dim.name
						)}
					</Tag>
				</Popover>
			));

		return (
			<InputSelectPopover
				label="Cut"
				menu={menu}
				active={applied}
				onClick={onCutAdd}
			/>
		);
	}

	renderMeasureSelector(props) {
		let { cube, measures, onMeasureChange } = props;

		if (!cube.measures) return null;

		return (
			<div className="pt-form-group">
				<label className="pt-label">Measures</label>
				{cube.measures.map(ms => (
					<Switch
						checked={measures.indexOf(ms) > -1}
						key={ms.key}
						onChange={evt => onMeasureChange(ms, evt.target.checked)}
						label={ms.name}
					/>
				))}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		cube: state.cubes.current,
		cubes: state.cubes.all,
		drilldowns: state.aggregators.drilldowns,
		measures: state.aggregators.measures,
		cuts: state.aggregators.cuts,
		error: state.cubes.error
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,

		onCubeSet(cube) {
			dispatch({ type: "CUBES_SET", payload: cube });
		},

		onDrilldownAdd(dim) {
			dispatch({ type: "DRILLDOWN_ADD", payload: dim });
		},

		onDrilldownDelete(dim) {
			dispatch({ type: "DRILLDOWN_DELETE", payload: dim });
		},

		onCutAdd(dim) {
			dispatch({ type: "CUT_ADD", payload: dim });
		},

		onCutDelete(dim) {
			dispatch({ type: "CUT_DELETE", payload: dim });
		},

		onMeasureChange(measure, checked) {
			dispatch({
				type: checked ? "MEASURE_ADD" : "MEASURE_DELETE",
				payload: measure
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAggregators);
