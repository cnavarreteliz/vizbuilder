import React from "react";
import { connect } from "react-redux";

import { flattenDimHierarchy } from "helpers/manageDimensions";

const css = { display: "flex", flexDirection: "row" };

function Chart(props) {
	return (
		<div style={css}>
			<dl>
				<dt>Cube</dt>
				<dd>{props.cb.name}</dd>
				<dt>{"Drilldowns (" + props.dd.length + ")"}</dt>
				<dd>
					<ul>{props.dd.map(i => <li>{i.name}</li>)}</ul>
				</dd>
				<dt>{"Measures (" + props.ms.length + ")"}</dt>
				<dd>
					<ul>{props.ms.map(i => <li>{i.name}</li>)}</ul>
				</dd>
			</dl>
			<div>
				<h3>Cubes</h3>
				<ul>{props.all_cb.map(i => <li>{i.name}</li>)}</ul>
			</div>
			<div>
				<h3>Drilldowns</h3>
				<ul>{props.all_dd.map(i => <li>{i.name}</li>)}</ul>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		all_cb: state.cubes.all,
		all_dd: flattenDimHierarchy(state.cubes.all),
		all_ms: [],
		cb: state.cubes.current,
		dd: state.aggregators.drilldowns,
		ms: state.aggregators.measures
	};
}

export default connect(mapStateToProps)(Chart);
