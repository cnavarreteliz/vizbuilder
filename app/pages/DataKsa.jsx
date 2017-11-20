import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataKsa(props) {
	return (
		<div className="container data-ksa">
			<LoadControl
				src="https://jobsksa.datawheel.us/"
				queryString={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent queryString={props.location.search} />
		</div>
	);
}

export default DataKsa;
