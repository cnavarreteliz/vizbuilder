import React from "react";
import { Link } from "react-router";

import "styles/Home.css"

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
						<img src="images/logo-datachile.svg" alt=""/>
					</Link>
				</li>
				<li className="menu-item">
					<Link to="/cny" className="site">
						CNY Vitals
					</Link>
				</li>
			</ul>
		</div>
	);
}

export default Home;
