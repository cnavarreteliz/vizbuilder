import React from "react";
import { Link } from "react-router";

function Home(props) {
	return (
		<div className="home">
			<ul className="menu">
				<li className="menu-item">
					<Link to="/ksa" className="site">
						ksa
					</Link>
				</li>
				<li className="menu-item">
					<Link to="/chile" className="site">
						chile
					</Link>
				</li>
			</ul>
		</div>
	);
}

export default Home;
