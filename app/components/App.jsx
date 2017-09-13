import { Tab2, Tabs2 } from "@blueprintjs/core";
import { connect } from "react-redux";

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
						<PanelChart />
						<ChartOptions />
						{/*<Timeline />*/}
					</div>
				</div>
			);
	}
}

function mapStateToProps(state) {
	return {
		show: state.data.values.length > 1
	};
}

export default connect(mapStateToProps)(App);
