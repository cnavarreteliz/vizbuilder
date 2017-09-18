import { Tab2, Tabs2 } from "@blueprintjs/core";
import { connect } from "react-redux";
import pluralize from "pluralize";

import ChartOptions from "components/ChartOptions";
import PanelAppearance from "components/PanelAppearance";
import PanelAssistant from "components/PanelAssistant";
import PanelChart from "components/PanelChart";
import ChartSelector from "components/ChartSelector";

import "nprogress/nprogress.css";
import "styles/App.css";
import logo from 'assets/logo.svg'

function App(props) {
	return (
		<div className="container">
			<div className="side-panel">
				<img src={logo} />
				<Tabs2>
					<Tab2 id="fil" title="Search" panel={<ChartSelector />} />
					<Tab2 id="chr" title="Appearance" panel={<PanelAppearance />} />
					<Tab2 id="ast" title="Advanced" panel={<PanelAssistant />} />
				</Tabs2>
			</div>
			<div className="main-panel">
				<div className="header-panel">
					<h1 className="title">{props.title}</h1>
					<h4 className="subtitle">{props.subtitle}</h4>
				</div>
				<PanelChart />
				<ChartOptions />
			</div>
		</div>
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
			subtitle: "sized by " + props.visuals.axis.y
		};
	}

	return { title: " ", subtitle: " " };
}

function mapStateToProps(state) {
	const header = prepareTitle(state);

	return {
		show: state.data.values.length > 1,
		title: header.title,
		subtitle: header.subtitle
	};
}

export default connect(mapStateToProps)(App);
