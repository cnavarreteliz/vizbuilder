import { Tab2, Tabs2 } from "@blueprintjs/core";
import { connect } from "react-redux";
import Pluralize from 'pluralize';

import PanelAssistant from "components/PanelAssistant";
import PanelAppearance from "components/PanelAppearance";
import PanelChart from "components/PanelChart";
import PanelSearch from "components/PanelSearch";
import ChartSelector from "components/ChartSelector";
import ChartOptions from "components/ChartOptions";
import PanelFilters from "components/PanelFilters";
import Timeline from "components/Timeline";

import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	switch (true) {
		case false:
			return <PanelSearch />;
		case true:
			return (
				<div className="container">
					<div className="side-panel">
						<img src="images/logo.svg" />
						<Tabs2>
							<Tab2 id="fil" title="Search" panel={<PanelFilters />} />
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
						{/*<Timeline />*/}
					</div>
				</div>
			);
	}
}

function prepareTitle(props) {
	if (props.data.values.length > 1) {
		let base = props.visuals.axis.x
		if (!base.includes('Age') && !base.includes('Gender')) {
			base = Pluralize(base)
		}
		return { 
			title: props.cubes.current.name + " by " + base + " (All years)",
			subtitle: "sized by " + props.visuals.axis.y
		}
	}

	return { title: " ", subtitle: " " }

}

function mapStateToProps(state) {
	const header = prepareTitle(state)
	return {
		show: state.data.values.length > 1,
		title: header.title,
		subtitle: header.subtitle
	};
	// (state.cubes.current ? state.cubes.current.name : '')
}

export default connect(mapStateToProps)(App);
