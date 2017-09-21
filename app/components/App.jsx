import { Tab2, Tabs2 } from "@blueprintjs/core";
import { connect } from "react-redux";
import pluralize from "pluralize";

import React from "react";
import CHARTS from "helpers/charts";

import ChartOptions from "components/ChartOptions";
import PanelAggregators from "components/PanelAggregators";
import PanelChart from "components/PanelChart";
import PanelFilters from "components/PanelFilters";
import PanelDownload from "components/PanelDownload";

import Search from "components/Search";

import { prepareHierarchy } from "helpers/prepareHierarchy";

import {
	Button,
	Menu,
	MenuItem,
	Popover,
	Position,
	Tag
} from "@blueprintjs/core";

import "nprogress/nprogress.css";
import "styles/App.css";
import logo from "assets/logo.svg";

function prepareIcons(props) {
	if (props.show_viz) {
		return (
			<div className="icons">
				{CHARTS.map(chart =>
					React.createElement("img", {
						title: chart.name,
						className: props.type == chart.name ? "icon active" : "icon",
						src: require("assets/charts/icon-" + chart.name + ".svg"),
						onClick() {
							props.onChangeViz(chart.name, props.panel);
						}
					})
				)}
			</div>
		);
	}
}

function prepareMainPanel(props) {
	if (props.x) {
		return (
			<div className="main-panel">
				<div className="header-panel">
					<h1 className="title">
						{props.cube.name + " by "}
						<span className="selector">
							{renderDrilldownSelector(props, props.x)}
						</span>
						{" (All years)"}
					</h1>
					<h4 className="subtitle">
						SIZED BY{" "}
						<span className="selector">
							{renderMeasureSelector(props, props.cube, props.y)}
						</span>
					</h4>
					<PanelDownload />
				</div>
				<PanelChart />
				<ChartOptions />
			</div>
		);
	} else {
		return (
			<div className="main-panel text-center">
				<div className="header-panel">
					<h1 className="title">KSA VizBuilder</h1>
					<h4 className="subtitle">Build your custom charts</h4>
				</div>
				<div> Every element with underline dashed can be customized </div>
			</div>
		);
	}
}

function App(props) {
	return (
		<div className="container">
			<div className="bar bar-1">
				<div className="icon selected">
					{React.createElement("img", {
						title: props.type,
						className: "icon",
						src: require("assets/charts/icon-" + props.type + ".svg"),
						onClick() {
							props.onToggleVizPanel(props.show_viz ? false : true);
						}
					})}
				</div>
				{prepareIcons(props)}
				<div className="search">
					<Search />
				</div>
			</div>
			<div className="panelContainer">
				{/*<Tabs2>
					<Tab2 id="fil" title="Search" panel={<PanelSearch />} />
					<Tab2 id="chr" title="Appearance" panel={<PanelAppearance />} />
					<Tab2 id="ast" title="Advanced" panel={<PanelAssistant />} />
				</Tabs2>*/}
				<PanelAggregators />

				{prepareMainPanel(props)}
			</div>
		</div>
	);
}
function renderDrilldownSelector(props, label) {
	let { cube, drilldowns, onDrilldownAdd } = props;

	if (!cube.dimensions) return null;

	let menu = prepareHierarchy(cube.dimensions);

	return (
		<InputDimensionPopover label={label} menu={menu} onClick={onDrilldownAdd} />
	);
}

function renderMeasureSelector(props, cube, label) {
	let { onMeasureChange } = props;

	if (!cube.measures) return null;

	let menu = cube.measures;

	return (
		<InputTitlePopover onClick={onMeasureChange} label={label} menu={menu} />
	);
}
function prepareTitle(props) {
	if (props.data.values.length > 1) {
		let base = props.visuals.axis.x;
		if (!base.includes("Age") && !base.includes("Gender")) {
			base = pluralize(base);
		}
		return {
			title: props.cubes.current.name + " by " + base + " (All years)",
			subtitle: "sized by "
		};
	}

	return { title: " ", subtitle: " " };
}

function InputTitlePopover(props) {
	function createMenuItem(item) {
		let children = null,
			attr = { key: item.fullName, text: item.name };
		attr.onClick = () => props.onClick(item);
		return React.createElement(MenuItem, attr, children);
	}

	return (
		<div className="pt-form-group">
			<Popover
				content={React.createElement(Menu, {}, props.menu.map(createMenuItem))}
				position={Position.BOTTOM}
			>
				<div> {props.label} </div>
			</Popover>
		</div>
	);
}

function InputDimensionPopover(props) {
	function createMenuItem(item) {
		let children = null,
			attr = { key: item._label, text: item._label };

		if (item._children.length == 0) {
			attr.onClick = () => props.onClick(item);
		} else {
			children = item._children.map(createMenuItem);
		}

		return React.createElement(MenuItem, attr, children);
	}

	return (
		<div className="pt-form-group">
			<Popover
				content={React.createElement(Menu, {}, props.menu.map(createMenuItem))}
				position={Position.BOTTOM}
			>
				{props.label}
			</Popover>
		</div>
	);
}

function mapStateToProps(state) {
	const header = prepareTitle(state);

	return {
		show_viz: state.visuals.panel.show,
		cube: state.cubes.current,
		show: state.data.values.length > 1,
		title: header.title,
		drilldowns: state.aggregators.drilldowns,
		subtitle: header.subtitle,
		y: state.visuals.axis.y,
		x: state.visuals.axis.x,
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		measures: state.aggregators.measures ? state.aggregators.measures : []
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onMeasureChange(measure) {
			dispatch({ type: "MEASURE_ADD", payload: measure });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "y",
				payload: measure.name
			});
		},
		onDrilldownAdd(dim) {
			dispatch({ type: "DRILLDOWN_ADD", payload: dim });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "x",
				payload: dim.name
			});
		},

		onToggleVizPanel(display) {
			dispatch({ type: "VIZ_PANEL_TOGGLE", payload: display });
		},

		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
