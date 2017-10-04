import React from "react";

import "typeface-montserrat";
import "typeface-pathway-gothic-one";
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
