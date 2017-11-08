import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

function DataKsa(props) {
	return (
		<div className="container data-oec">
			<LoadControl
				src="http://oec-cube.datawheel.us/"
				slug={props.params.slug}
				search={props.location.search}
			/>
			<AreaSidebar />
			<AreaContent />
		</div>
	);
}

export default DataKsa;
