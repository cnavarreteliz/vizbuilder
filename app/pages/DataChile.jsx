import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataChile(props) {

	return (
		<div className="container data-chile">
			<LoadControl
				src="https://chilecube.datawheel.us/"
				slug={props.params.slug}
				search={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent />
		</div>
	);
}

export default DataChile;
