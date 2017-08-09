import React, { Component } from "react";

import countries from "data/countries.json";
import testdata from "data/bulk.json";

import Filter, { defaultFilter, applyFilters } from "components/Filter";
import Reducer, { defaultReducer, applyReducers } from "components/Reducer";

import Selector from "components/Selector";
import VizSelector from "components/VizSelector";
import YearSelector from "components/YearSelector";
import VizBuilder from "components/VizBuilder";

import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			viz: {
				type: "treemap",
				panel: true
			},
			filters: [],
			reducers: [],
			source: "location",
			value: null,
			axis: ['gender', 'location']
		};

		this.handleChangeViz = this.handleChangeViz.bind(this);
		this.handleChangeAxis = this.handleChangeAxis.bind(this);
		this.handleFilterAdd = this.handleFilterAdd.bind(this);
		this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
	}

	handleChangeAxis(event) {
		console.log(event)
		this.setState({
			source: event.target.value
		});
	}

	handleChangeViz(event) {
		this.setState({
			value: event,
			viz: {
				type: event.name,
				panel: event.panel
			}
		});
	}

	handleFilterAdd() {
		this.setState({
			filters: [].concat(this.state.filters, defaultFilter)
		});
	}

	handleFilterUpdate(index, props) {
		let filters = [].concat(this.state.filters);

		filters[index] = Object.assign({}, filters[index], props);

		this.setState({
			filters
		});
	}

	renderFilters(filters, onChange) {
		let columns = Object.keys(testdata[0]);

		return filters.map((filter, idx) =>
			<Filter
				key={idx}
				columns={columns}
				property={filter.property}
				operator={filter.operator}
				value={filter.value}
				index={idx}
				onChange={onChange}
			/>
		);
	}

	render() {
		const viz_types = [
			{ name: "Treemap", id: "treemap" },
			{ name: "Donut", id: "donut" }
		];

		return (
			<div className="wrapper">
				<div className="container">
					<div className="panel">
						<VizSelector
							handleChangeViz={this.handleChangeViz}
							handleChangeAxis={this.handleChangeAxis}
							config={this.state.viz}
							axis={this.state.axis}
							source={this.state.source}
						/>
						{/* <Selector options={countries} type={"country"} />
						<YearSelector since={1990} until={2010} /> */}
						{this.renderFilters(this.state.filters, this.handleFilterUpdate)}
						<button onClick={this.handleFilterAdd}>Add filter</button>
					</div>
					<div className="viz-wrapper">
						<VizBuilder
							type={this.state.viz.type}
							config={{
								data: applyReducers(
									applyFilters(testdata, this.state.filters),
									this.state.reducers,
									this.state.source
								),
								title: "Hello"
							}}
						/>
					</div>
				</div>
				<div className="timeline" />
			</div>
		);
	}
}

export default App;
