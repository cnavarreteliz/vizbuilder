import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "components/App";
import Home from "pages/Home";
import DataChile from "pages/DataChile";
import DataKsa from "pages/DataKsa";
import NotFound from "pages/NotFound";

export default function RouteCreate() {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="ksa" component={DataKsa} />
			<Route path="chile" component={DataChile} />
			<Route path="*" component={NotFound} status={404} />
		</Route>
	);
}
