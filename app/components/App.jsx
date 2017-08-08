import React, { Component } from "react";
//import Data from 'data/bulk.json';
import Countries from "data/countries.json";
import YearSelector from "components/YearSelector";
import Selector from "components/Selector";
import VizBuilder from "components/VizBuilder";
import VizSelector from "components/VizSelector";
import { Treemap, Donut } from "d3plus-react";

import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viz: "treemap",
			value: null
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log(event)
		this.setState({
			value: event,
			viz: event
		});
		//this.forceUpdate() event.target.value
	}

	render() {
		const data = [
			{ parent: "Group 1", id: "alpha", value: 29 },
			{ parent: "Group 1", id: "beta", value: 10 },
			{ parent: "Group 1", id: "gamma", value: 2 },
			{ parent: "Group 2", id: "delta", value: 29 },
			{ parent: "Group 2", id: "eta", value: 25 }
		];

		const viz_types = [
			{ name: "Treemap", id: "treemap" },
			{ name: "Donut", id: "donut" }
		];
		const { children } = this.props;

		return (
			<div className="wrapper">
				<div className="container">
					<div className="panel">
						<VizSelector handleChange={this.handleChange}/>
						<Selector options={Countries} type={"country"} />
						<YearSelector since={1990} until={2010} />
					</div>
					<div className="viz-wrapper">
						<VizBuilder type={this.state.viz} config={{ data }} />
					</div>
				</div>
				<div className="timeline" />
			</div>
		);
	}
}

export default App;
