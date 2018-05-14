import React from "react";

import AreaContent from "components/AreaContent";
import AreaSidebar from "components/AreaSidebar";
import LoadControl from "components/LoadControl";

import "./Home.css";

function Home(props) {
  return (
    <div className="container">
      <LoadControl
        src="https://chilecube.datawheel.us/"
        queryString={props.location.search}
      />
      <AreaSidebar />
      <AreaContent queryString={props.location.search} />
    </div>
  );
}

export default Home;
