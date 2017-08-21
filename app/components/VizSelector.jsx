import React, { Component } from "react";
import { connect } from "react-redux";

import { requestCubes, requestQuery } from "actions/mondrian";
import VizSelectorPanel from "components/VizSelectorPanel";

import icons from "data/visual-options.json";
import "./VizSelector.css";

class VizSelector extends Component {
	componentDidMount() {
		const { dispatch, cube, dimension, measure } = this.props;
		dispatch(requestCubes());
		dispatch(requestQuery(cube, dimension, measure));
	}

	componentDidUpdate(prev) {
		const { dispatch, cube, dimension, measure } = this.props;
		console.log(this.props, prev)
		if (
			cube != prev.cube ||
			dimension != prev.dimension ||
			measure != prev.measure
		) {
			dispatch(requestQuery(cube, dimension, measure));
		}
	}

	renderVizOptions(props) {
		return icons.map(icon =>
			React.createElement("img", {
				title: icon.title,
				className: props.type == icon.name ? "icon active" : "icon",
				src: "/images/viz/icon-" + icon.name + ".svg",
				onClick() {
					props.onChangeViz(icon.name);
				}
			})
		);
	}

	renderPanelOptions(props) {
		if (props.panel) {
			return (
				<div className="panel-options">
					<p className="title">Options</p>
					<VizSelectorPanel
						label="Cube"
						onChange={props.onChangeCube}
						options={props.opt_cube}
						value={props.cube}
					/>
					<VizSelectorPanel
						label="Dimension"
						onChange={props.onChangeDimension}
						options={props.opt_dimension}
						value={props.dimension}
					/>
					<VizSelectorPanel
						label="Measure"
						onChange={props.onChangeMeasure}
						options={props.opt_measure}
						value={props.measure}
					/>
				</div>
			);
		}
	}

	render() {
		console.log(this.props);
		return (
			<div className="viz-selector-wrapper">
				<div className="title">Visualizations</div>
				<div className="icons">
					{this.renderVizOptions(this.props)}
				</div>
				{this.renderPanelOptions(this.props)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		cube: state.data.cube,
		dimension: state.data.dimension,
		measure: state.data.measure,
		year: state.data.year,
		
		opt_cube: state.options.cubes,
		opt_dimension: state.options.dimensions,
		opt_measure: state.options.measures,

		type: state.visuals.type,
		panel: state.visuals.type != 'bubble'
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		
		onChangeCube(cube) {
			dispatch({ type: "AXIS_UPDATE", cube });
		},

		onChangeDimension(dimension) {
			dispatch({ type: "AXIS_UPDATE", dimension });
		},

		onChangeMeasure(measure) {
			dispatch({ type: "AXIS_UPDATE", measure });
		},

		onChangeViz(type) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(VizSelector);
