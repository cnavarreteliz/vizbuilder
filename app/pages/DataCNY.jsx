import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataCNY(props) {
	return (
		<div className="container data-cny">
			<LoadControl
				src="https://cny-bullfrog.datawheel.us/"
				queryString={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent />
		</div>
	);
}

export default DataCNY;
