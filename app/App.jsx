import React from "react";

import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	return (
		<div className="wrapper">
			{props.children}
		</div>
	);
}

export default App;
