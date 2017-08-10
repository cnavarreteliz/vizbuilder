import React, { Component } from "react";
import deepExtend from "deep-extend";

import countries from "data/countries.json";
import testdata from "data/bulk.json";
import properties from "data/properties.json";

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
			source: "country",
			value: null,
			size: "export_1",
			axis_options: this.getProperty(properties, 'axis'),
			size_options: this.getProperty(properties, 'size')
		};

		this.handleChangeViz = this.handleChangeViz.bind(this);
		this.handleChangeAxis = this.handleChangeAxis.bind(this);
		this.handleChangeSize = this.handleChangeSize.bind(this);
		this.handleFilterAdd = this.handleFilterAdd.bind(this);
		this.handleFilterRemove = this.handleFilterRemove.bind(this);
		this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
	}

	getProperty(data, attribute) {
		var output = []
		data.map(e =>
			{if(e.category == attribute) {
				output.push(e.property)
			}}
		)
		console.log(output)
		return output
	}

	handleChangeAxis(event) {
		console.log(event)
		this.setState({
			source: event.target.value
		});
	}

	handleChangeSize(event) {
		this.setState({
			size: event.target.value
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

	handleFilterRemove(index) {
		let filters = [].concat(this.state.filters);

		filters.splice(index, 1);

		this.setState({ filters });
	}

	handleFilterUpdate(index, props) {
		let filters = [].concat(this.state.filters);

		filters[index] = deepExtend({}, filters[index], props);

		this.setState({ filters });
	}

	renderFilters(filters, onChange, onDelete) {
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
				onDelete={onDelete}
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
					<div className="main-panel">
						<VizSelector
							handleChangeViz={this.handleChangeViz}
							handleChangeAxis={this.handleChangeAxis}
							handleChangeSize={this.handleChangeSize}
							config={this.state.viz}
							axis={this.state.axis_options}
							size_options={this.state.size_options}
							size={this.state.size}
							source={this.state.source}
						/>
<<<<<<< HEAD
						{/* <Selector options={countries} type={"country"} />
						<YearSelector since={1990} until={2010} /> */}
						{this.renderFilters(this.state.filters, this.handleFilterUpdate)}
						<button className="btn" onClick={this.handleFilterAdd}>Add filter</button>
=======
						{this.renderFilters(
							this.state.filters,
							this.handleFilterUpdate,
							this.handleFilterRemove
						)}
						<button onClick={this.handleFilterAdd}>Add filter</button>
>>>>>>> 76e6843bf1a6d7e02f5607586b81e7443687bfdd
					</div>
					<div className="viz-wrapper">
						<VizBuilder
							type={this.state.viz.type}
							config={{
								data: applyReducers(
									applyFilters(testdata, this.state.filters),
									this.state.reducers,
									this.state.source,
									this.state.size
								),
								title: "Hello",
								size: this.state.size
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
