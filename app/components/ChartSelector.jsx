import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function CustomSelector(props) {
	return (
		<label className="pt-label pt-inline">
			{props.name}
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
	return (
		<div className="chartoptions-wrapper">
			<div className="title">{props.type}</div>
			<div className="icons">
				{icons.map(icon =>
					React.createElement("img", {
						title: icon.title,
						className: props.type == icon.name ? "icon active" : "icon",
						src: "/images/viz/icon-" + icon.name + ".svg",
						onClick() {
							props.onChangeViz(icon.name, icon.panel);
						}
					})
				)}
				{/* Custom search */}
				<div>
					Show me
					<SmartSelector
						options={props.ninput}
						value={props.x.value}
						onChange={evt => props.onSearchChange(evt.target.value)}
					/>
				</div>
				{/*{ChartAxis(props)}*/}
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
						<option value={ item.dimension }>
							{item.name}
						</option>
					))}
				</select>
			</div>
		</label>
	);
}

function getMeasures(data) {
	return data
		.filter(e => e.name.includes("Salary Sum"));
}

// Detect Time Dimension in Series
function TimeDimensions(data) {
	return data.filter(e => e.dimensionType == 1).map(e => e.name);
}

function naturalInput(dimensions, measures, cube) {
	let data = [];
	dimensions.filter(dm => dm.dimensionType == 0).forEach(dm => {
		measures.forEach(ms => {
			data.push({
				name: ms.name + " by " + dm.name + " in " + cube,
				_children: dm._children ? dm._children.map(e => e.name) : [],
				measure: ms,
				dimension: dm,
				cube: cube
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
			state.cubes.current.dimensions,
			getMeasures(state.cubes.current.measures),
			state.cubes.current.name
		),

		x: {
			//labels: state.aggregators.drilldowns.map(e => e.name),
			value: state.visuals.axis.x
		},

		y: {
			//labels: state.aggregators.measures.map(e => e.name),
			//labels: getMeasures(state.cubes.current.measures),
			value: state.visuals.axis.y
		},

		year: {
			labels: TimeDimensions(state.cubes.current.dimensions),
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
			
			dispatch({ type: "DATA_SET", measure: "Salary Sum", dimension: {data} });
			this.onSetAxis("x", "Gender")
			this.onSetAxis("y", "Salary Sum")
			//dispatch({ type: "VIZ_FULL_UPDATE", measure: measure });
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
