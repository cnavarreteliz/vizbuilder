import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import deepExtend from "deep-extend";

import countries from "data/countries.json";
import testdata from "data/bulk.json";
import properties from "data/properties.json";
import { getData } from "helpers/stats";

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
			data: testdata,
			viz: {
				type: "treemap",
				panel: true
			},
			filters: [],
			reducers: [],
			dimension: "occupation",
			value: null,
			measure: "Salary Sum",
			axis_options: this.getProperty(properties, "axis"),
			size_options: this.getProperty(properties, "size")
		};

		this.handleChangeViz = this.handleChangeViz.bind(this);
		this.handleChangeAxis = this.handleChangeAxis.bind(this);
		this.handleChangeMeasure = this.handleChangeMeasure.bind(this);
		this.handleFilterAdd = this.handleFilterAdd.bind(this);
		this.handleFilterRemove = this.handleFilterRemove.bind(this);
		this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
		this.renderFilters = this.renderFilters.bind(this);
		this.getKSAdata = this.getKSAdata.bind(this);

		this.getKSAdata("Employee Records", this.state.dimension, this.state.measure)
		
	}

	

	getKSAdata(cubeName, dimension, measure) {
		// Experiments
		getData(cubeName, dimension, measure).promise.then(data => {
			console.log(data)
			const ksa_data = data[1].values.map((level1, i) => {
				return {
					year: 2016,
					value: parseFloat(level1[0][0]),
					id: i + 1,
					name: data[1].axes[2].members[i].name,
					group: data[1].axes[2].members[i].name[0]
				};
			});
			this.setState({
				data: ksa_data
			});
		});
	}

	getProperty(data, attribute) {
		var output = [];
		data.map(e => {
			if (e.category == attribute) {
				output.push(e.property);
			}
		});
		console.log(output);
		return output;
	}

	handleChangeAxis(event) {
		console.log(event);
		this.setState({
			dimension: event.target.value
		});
		this.getKSAdata("Employee Records", event.target.value, this.state.measure)
	}

	handleChangeMeasure(event) {
		this.setState({
			measure: event.target.value
		});
		this.getKSAdata("Employee Records", this.state.dimension, event.target.value)
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
		let columns = Object.keys(this.state.data[0]);

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
		
		return (
			<div className="wrapper">
				<div className="container">
					<div className="main-panel">
						<VizSelector
							handleChangeViz={this.handleChangeViz}
							handleChangeAxis={this.handleChangeAxis}
							handleChangeMeasure={this.handleChangeMeasure}
							config={this.state.viz}
							axis={this.state.axis_options}
							size_options={this.state.size_options}
							size={this.state.measure}
							dimension={this.state.dimension}
						/>
						{this.renderFilters(
							this.state.filters,
							this.handleFilterUpdate,
							this.handleFilterRemove
						)}
						<Button
							className="pt-fill"
							iconName="add"
							onClick={this.handleFilterAdd}
						>
							Add filter
						</Button>
					</div>
					<div className="viz-wrapper">
						<VizBuilder
							type={this.state.viz.type}
							config={{
								data: applyReducers(
									applyFilters(this.state.data, this.state.filters),
									this.state.reducers,
									this.state.dimension,
									this.state.measure
								),
								title: "Hello",
								size: this.state.measure,
								groupBy: ["group", "name"]
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
