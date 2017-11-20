import React from "react";
import { Route, Router, IndexRoute } from "react-router";

import App from "App";
import Home from "pages/Home";
import DataChile from "pages/DataChile";
import DataKsa from "pages/DataKsa";
import DataCNY from "pages/DataCNY";
import DataOEC from "pages/DataOEC";
import NotFound from "pages/NotFound";
import Toolbar from "components/Toolbar";

export default function RouteCreate() {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="ksa" component={DataKsa} />
			<Route path="chile" component={DataChile} />
			<Route path="cny" component={DataCNY} />
			<Route path="oec" component={DataOEC} />
			<Route path="*" component={NotFound} status={404} />
		</Route>
	);
}
