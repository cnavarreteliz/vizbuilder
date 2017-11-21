import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataChile(props) {
	return (
		<div className="container data-chile">
			<LoadControl
				src="https://chilecube.datawheel.us/"
				queryString={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent queryString={props.location.search} />
		</div>
	);
}

export default DataChile;
