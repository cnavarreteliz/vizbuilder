import { Tab2, Tabs2 } from "@blueprintjs/core";
import { connect } from "react-redux";
import pluralize from "pluralize";
import InputSelectPopover from "components/InputSelectPopover";

import { createElement } from "react";

import ChartOptions from "components/ChartOptions";
import PanelAppearance from "components/PanelAppearance";
import PanelAssistant from "components/PanelAssistant";
import PanelChart from "components/PanelChart";
import PanelSearch from "components/PanelSearch";
import PanelDownload from "components/PanelDownload";
import ChartSelector from "components/ChartSelector";
import InlineSelect from "components/InlineSelect";
import NaturalSelectors from "components/PhraseSelectors";

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

function App(props) {
	return (
		<div className="container">
			<div className="side-panel">
				<img src={logo} />
				<Tabs2>
					<Tab2 id="fil" title="Search" panel={<PanelSearch />} />
					<Tab2 id="chr" title="Appearance" panel={<PanelAppearance />} />
					<Tab2 id="ast" title="Advanced" panel={<PanelAssistant />} />
				</Tabs2>
			</div>
			<div className="main-panel">
				<div className="header-panel">
					<h1 className="title">{props.title}</h1>
					<h4 className="subtitle">
						SIZED BY <span className="selector">{props.subtitle ? renderMeasuresSelector(props, props.cube, props.y) : ""}</span>
					</h4>
					<PanelDownload />
				</div>
				<PanelChart />
				<ChartOptions />
			</div>
		</div>
	);
}
function renderMeasuresSelector(props, cube, label) {
	let { onMeasureChange } = props;

	if (!cube.measures) return null;

	let menu = cube.measures;

	return <InputTitlePopover onClick={onMeasureChange} label={label} menu={menu} />;
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
		return createElement(MenuItem, attr, children);
	}

	return (
		<div className="pt-form-group">
			<Popover
				content={createElement(Menu, {}, props.menu.map(createMenuItem))}
				position={Position.BOTTOM}
			>
				<div> {props.label} </div>
			</Popover>
		</div>
	);
}

function mapStateToProps(state) {
	const header = prepareTitle(state);

	return {
		cube: state.cubes.current,
		show: state.data.values.length > 1,
		title: header.title,
		subtitle: header.subtitle,
		y: state.visuals.axis.y,
		measures: state.aggregators.measures ? state.aggregators.measures : []
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onMeasureChange(measure) {
			console.log(measure)
			//dispatch({ type: "MEASURE_ADD", payload: measure });
		}
	}
}

export default connect(mapStateToProps)(App);
