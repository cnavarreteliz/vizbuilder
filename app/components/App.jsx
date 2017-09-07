import { Tab2, Tabs2 } from "@blueprintjs/core";

import PanelAssistant from "components/PanelAssistant";
import PanelAppearance from "components/PanelAppearance";
import PanelChart from "components/PanelChart";
import ChartSelector from "components/ChartSelector";
import PanelFilters from "components/PanelFilters";
import Timeline from "components/Timeline";


import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	return (
		<div className="container">
			<div className="side-panel">
				<img src="images/logo.svg" />
				<Tabs2>
					<Tab2 id="fil" title="Search" panel={<PanelFilters />} />
					<Tab2 id="chr" title="Appearance" panel={<PanelAppearance />} />
					<Tab2 id="ast" title="Assistant" panel={<PanelAssistant />} />
				</Tabs2>
			</div>
			<div className="main-panel">
				<PanelChart />
				{/* <Timeline /> */}
			</div>
		</div>
	);
}

export default App;
