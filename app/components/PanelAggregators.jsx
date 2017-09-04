import { Component, createElement } from "react";
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

import { requestCubes, requestQuery, buildQuery } from "actions/mondrian";
import InputSelect from "components/InputSelect";
import InputSelectPopover from "components/InputSelectPopover";

import "styles/PanelAggregators.css";

class PanelAggregators extends Component {
	componentDidMount() {
		this.props.dispatch(requestCubes());
	}

	componentDidUpdate(prev) {
		const { cube, drilldowns, measures, cuts, error } = this.props;

		if (
			cube.name != prev.cube.name ||
			drilldowns != prev.drilldowns ||
			measures != prev.measures ||
			cuts != prev.cuts
		) {
			let query = buildQuery(cube, drilldowns, measures, cuts);
			this.props.dispatch(requestQuery(query));
		}

		if (error != prev.error)
			alert({ message: error.message });
	}

	render() {
		const props = this.props;

		return (
			<div className="aggregators-wrapper">
				<InputSelect
					title="Database"
					options={props.cubes.map(cube => ({ label: cube.name }))}
					value={props.cube.name}
					onChange={evt => props.onCubeSet(evt.target.value)}
				/>
				{/* {this.renderDrilldownSelector(props)} */}
				{/* {this.renderCutSelector(props)} */}
				{/* {this.renderMeasureSelector(props)} */}
			</div>
		);
	}

	renderDrilldownSelector(props) {
		let { cube, drilldowns, onDrilldownAdd, onDrilldownDelete } = props;

		if (!cube.dimensions) return null;

		let menu = prepareHierarchyMenu(cube.dimensions);

		let applied = drilldowns.map(dim => (
			<Tag key={dim.fullName} onRemove={() => onDrilldownDelete(dim)}>
				{dim.hierarchy.dimension.name == dim.name ? (
					dim.name
				) : (
					dim.hierarchy.dimension.name + " > " + dim.name
				)}
			</Tag>
		));

		return (
			<InputSelectPopover
				label="Serie"
				menu={menu}
				active={applied}
				onClick={onDrilldownAdd}
			/>
		);
	}

	renderCutSelector(props) {
		let { cube, cuts, onCutAdd, onCutDelete } = props;

		if (!cube.dimensions) return null;

		let menu = prepareHierarchyMenu(cube.dimensions);

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
						key={ms.fullName}
						onChange={evt => onMeasureChange(ms, evt.target.checked)}
						label={ms.caption}
					/>
				))}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		cube: state.cubes.current || {},
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
			if (checked) dispatch({ type: "MEASURE_ADD", payload: measure });
			else dispatch({ type: "MEASURE_DELETE", payload: measure });
		}
	};
}

function prepareHierarchyMenu(root) {
	return root.map(item => {
		let label = item.name,
			children = [];

		if (item.hierarchies) children = item.hierarchies[0].levels.slice(1);

		if (children.length > 1) {
			children = prepareHierarchyMenu(children);
		} else if (children.length == 1) {
			item = children[0];
			children = [];
			if (label != item.name) label += " > " + item.name;
		}

		item._children = children;
		item._label = label;
		return item;
	});
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAggregators);
