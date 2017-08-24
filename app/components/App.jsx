import ChartSelector from "components/ChartSelector";
import PanelAggregators from "components/PanelAggregators";
import PanelAssistant from "components/PanelAssistant";
import PanelChart from "components/PanelChart";
import PanelFilters from "components/PanelFilters";
import Timeline from "components/Timeline";

import "styles/App.css";

function App(props) {
	return (
		<div className="container">
			<div className="side-panel">
				<PanelAggregators />
				<PanelFilters />
			</div>
			<div className="main-panel">
				<ChartSelector />
				<PanelChart />
				<Timeline />
			</div>
			<div className="side-panel">
				<PanelAssistant />
			</div>
		</div>
	);
}

export default App;
