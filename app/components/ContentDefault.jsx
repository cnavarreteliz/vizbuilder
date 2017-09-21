import React from "react";

import Search from "components/Search";

function ContentDefault(props) {
	return (
		<div className="main-panel">
			<div className="header">
				<p className="title">KSA VizBuilder</p>
				<p className="subtitle">Build your custom charts</p>
			</div>
			<Search />
			<p>Every element with dashed can be customized</p>
		</div>
	);
}

export default ContentDefault;
