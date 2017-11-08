import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "App";
import Home from "pages/Home";
import DataChile from "pages/DataChile";
import DataKsa from "pages/DataKsa";
import DataCNY from "pages/DataCNY";
import DataOEC from "pages/DataOEC";
import NotFound from "pages/NotFound";

export default function RouteCreate() {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="ksa(/:slug)" component={DataKsa} />
			<Route path="chile(/:slug)" component={DataChile} />
			<Route path="cny(/:slug)" component={DataCNY} />
			<Route path="oec(/:slug)" component={DataOEC} />
			<Route path="*" component={NotFound} status={404} />
		</Route>
	);
}
