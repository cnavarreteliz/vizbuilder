import React from "react";

import AreaContent from "components/AreaContent";
import AreaTop from "components/AreaTop";
import LoadControl from "components/LoadControl";

import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	return (
		<div className="container">
			<LoadControl />
			<AreaTop />
			<AreaContent />
		</div>
	);
}

export default App;
