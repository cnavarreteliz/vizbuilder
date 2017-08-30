import { Component } from "react";
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

// import InputChecklist from "components/InputChecklist";
// import InputSelect from "components/InputSelect";

import "styles/PanelAggregators.css";

class PanelAggregators extends Component {
	componentDidMount() {
		this.props.dispatch(requestCubes());
	}

	componentDidUpdate(prev) {
		const { dispatch, cube, drilldowns, measures, cuts } = this.props;

		if (
			cube.name != prev.cube.name ||
			drilldowns != prev.drilldowns ||
			measures != prev.measures ||
			cuts != prev.cuts
		) {
			let query = buildQuery(cube, drilldowns, measures, cuts);
			dispatch(requestQuery(query));
		}
	}

	render() {
		let props = this.props;

		return (
			<div className="aggregators-wrapper">
				{this.renderCubeSelector(this.props)}
				{this.renderDrilldownSelector(this.props, this.renderSelect)}
				{this.renderCutSelector(this.props, this.renderSelect)}
				{this.renderMeasureSelector(this.props)}
			</div>
		);
	}

	renderCubeSelector(props) {
		let options = props.cubes.map(cube =>
			<option value={cube.name}>
				{cube.name}
			</option>
		);

		return (
			<label className="pt-label">
				<span>Database</span>
				<div className="pt-select">
					<select
						value={props.cube.name}
						disabled={props.cubes.length == 0}
						onChange={evt => props.onCubeSet(evt.target.value)}
					>
						<option>Select...</option>
						{options}
					</select>
				</div>
			</label>
		);
	}

	renderDrilldownSelector(props, render) {
		let { cube, drilldowns, onDrilldownAdd, onDrilldownDelete } = props;

		if (!cube.dimensions) return null;

		let menu = cube.dimensions.map(dim =>
			<MenuItem key={dim.fullName} text={dim.name}>
				{dim.hierarchies[0].levels
					.slice(1)
					.map(lvl =>
						<MenuItem
							key={dim.fullName}
							text={lvl.name}
							onClick={() => onDrilldownAdd(lvl)}
						/>
					)}
			</MenuItem>
		);

		let applied = drilldowns.map(dim =>
			<Tag key={dim.fullName} onRemove={() => onDrilldownDelete(dim)}>
				{dim.hierarchy.dimension.name} / {dim.name}
			</Tag>
		);

		return render("Serie", menu, applied);
	}

	renderCutSelector(props, render) {
		let { cube, cuts, onCutAdd, onCutDelete } = props;

		if (!cube.dimensions) return null;

		let menu = cube.dimensions.map(dim =>
			<MenuItem key={dim.fullName} text={dim.name}>
				{dim.hierarchies[0].levels
					.slice(1)
					.map(lvl =>
						<MenuItem
							key={dim.fullName}
							text={lvl.name}
							onClick={evt => onCutAdd(lvl)}
						/>
					)}
			</MenuItem>
		);

		let applied = Object.keys(cuts).map(key => cuts[key]).map(cut =>
			<Popover content={"ASDF"} position={Position.LEFT_TOP}>
				<Tag key={cut.dim.fullName} onRemove={() => onCutDelete(cut.dim.fullName)}>
					{cut.dim.hierarchy.dimension.name} / {cut.dim.name}
				</Tag>
			</Popover>
		);

		return render("Cut", menu, applied);
	}

	renderMeasureSelector(props) {
		let { cube, measures, onMeasureChange } = props;

		if (!cube.measures) return null;

		return (
			<div className="pt-form-group">
				<label className="pt-label">Measures</label>
				{cube.measures.map(ms =>
					<Switch
						checked={measures.indexOf(ms) > -1}
						key={ms.fullName}
						onChange={evt => onMeasureChange(ms, evt.target.checked)}
						label={ms.caption}
					/>
				)}
			</div>
		);
	}

	renderSelect(label, menu, applied) {
		return (
			<div className="pt-form-group">
				<label className="pt-label">{`${label}s`}</label>
				<Popover
					content={
						<Menu>
							{menu}
						</Menu>
					}
					position={Position.RIGHT_TOP}
				>
					<Button className="pt-fill" iconName="add" text={`Add ${label}...`} />
				</Popover>
				<div className="labels">
					{applied}
				</div>
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
			if (checked)
				dispatch({ type: "MEASURE_ADD", payload: measure });
			else
				dispatch({ type: "MEASURE_DELETE", payload: measure });				
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAggregators);
