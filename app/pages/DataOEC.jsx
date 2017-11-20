import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataKsa(props) {
	return (
		<div className="container data-oec">
			<LoadControl
				src="http://oec-cube.datawheel.us/"
				queryString={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent queryString={props.location.search} />
		</div>
	);
}

export default DataKsa;
