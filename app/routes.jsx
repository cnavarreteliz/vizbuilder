import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "components/App";

export default function RouteCreate() {
	return <Route path="/" component={App} />;
}
