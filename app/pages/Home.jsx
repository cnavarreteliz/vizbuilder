import React from "react";
import { Link } from "react-router";

import "styles/Home.css";
import logo_datachile from "assets/logo-datachile.svg";

function Home(props) {
	return (
		<div className="home">
			<ul className="menu">
				<li className="menu-item">
					<Link to="/ksa" className="site">
						Jobs KSA
					</Link>
				</li>
				<li className="menu-item">
					<Link to="/chile" className="site">
						<img src={logo_datachile} alt="DataChile" />
					</Link>
				</li>
				<li className="menu-item">
					<Link to="/cny" className="site">
						CNY Vitals
					</Link>
				</li>
				<li className="menu-item">
					<Link to="/oec" className="site">
						OEC
					</Link>
				</li>
			</ul>
		</div>
	);
}

export default Home;
