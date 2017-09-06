import React from "react";
import Select from "react-select";
import { connect } from "react-redux";

import icons from "data/visual-options.json";
import "react-select/dist/react-select.css";

import "styles/ChartSelector.css";

function CustomSelector(props) {
	return (
		<label className="pt-label pt-inline">
			<div className="title">{props.name}</div>
			<div className="pt-select">
				<select value={props.value} onChange={props.onChange}>
					<option>Select...</option>
					{props.options.map(item => <option value={item}>{item}</option>)}
				</select>
			</div>
		</label>
	);
}

function ChartAxis(props) {
	switch (props.panel) {
		case "PANEL_TYPE_NORMAL":
			return (
				<div>
					<CustomSelector
						name="Dimension"
						options={props.x.labels}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						name="Size"
						options={props.y.labels}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					<CustomSelector
						name="Axis"
						options={props.x.labels}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						name="Value"
						options={props.y.labels}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
					<CustomSelector
						name="Year"
						options={props.year.labels}
						value={props.year.value}
						onChange={evt => props.onSetAxis("year", evt.target.value)}
					/>
				</div>
			);
	}
}

function ChartSelector(props) {
	let { onSearchChange } = props;
	return (
		<div className="chartoptions-wrapper">
			<div>
				<div className="title">Show me ...</div>
				<Select
					name="form-field-name"
					options={props.ninput}
					value={props.x.va}
					placeholder="Search any dimension/measure"
					onChange={onSearchChange}
				/>
			</div>
			{/*{ChartAxis(props)}*/}
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

function getMeasures(data) {
	return data.filter(
		e => e.name.includes("Salary Sum")
	);
}

// Detect Time Dimension in Series
function timeDimensions(data) {
	return data.filter(e => e.dimensionType == 1).map(e => e.name);
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

function naturalInput(dimensions, measures, cubes) {
	let data = [];
	//filter(dm => dm.dimensionType == 0).
	cubes.map(cube => {
		dimensions.map(dm => {
			measures.map(ms => {
				if (dm._children.lenght == 0) {
					data.push({
						label: ms.name + " by " + dm.name + " in " + cube.name,
						value: {
							measure: ms,
							dimension: dm,
							cube: cube.name
						}
					});
				} else {
					dm._children.map(e => {
						data.push({
							label: ms.name + " by " + e.name + " in " + cube.name,
							value: {
								measure: ms,
								dimension: e,
								cube: cube.name
							}
						});
					});
				}
			});
		});
	});

	return data;
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.panel,
		type: state.visuals.type,
		ninput: naturalInput(
			prepareHierarchyMenu(state.cubes.current.dimensions),
			getMeasures(state.cubes.current.measures),
			state.cubes.all
		),

		x: {
			labels: state.aggregators.drilldowns.map(e => e.name),
			value: state.visuals.axis.x
		},

		y: {
			labels: state.aggregators.measures.map(e => e.name),
			//labels: getMeasures(state.cubes.current.measures),
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
			console.log(data.value.measure);
			dispatch({
				type: "DATA_SET",
				payload: {
					measure: data.value.measure,
					dimension: data.value.dimension
				}
			});
			//this.onSetAxis("x", "Sector");
			//this.onSetAxis("y", "Salary Sum");
			dispatch({
				type: "VIZ_FULL_UPDATE",
				dimension: data.value.dimension.name,
				measure: data.value.measure.name
			});
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
