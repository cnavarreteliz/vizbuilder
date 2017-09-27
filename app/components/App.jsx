import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

import "typeface-montserrat";
import "typeface-pathway-gothic-one";
import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	return (
		<div className="container">
			<LoadControl />
			<AreaSidebar />
			<AreaContent />
		</div>
	);
}

export default App;
