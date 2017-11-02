import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataKsa(props) {
	return (
		<div className="container data-oec">
			<LoadControl src='https://mondrian-rest.jazzido.com/' />
			<AreaSidebar />
			<AreaContent />
		</div>
	);
}

export default DataKsa