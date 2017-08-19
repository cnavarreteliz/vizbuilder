import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@blueprintjs/core";

import countries from "data/countries.json";
import properties from "data/properties.json";
import { getData } from "helpers/stats";

import Filter, { defaultFilter, applyFilters } from "components/Filter";

import Selector from "components/Selector";
import VizSelector from "components/VizSelector";
import YearSelector from "components/YearSelector";
import VizBuilder from "components/VizBuilder";

import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			viz: {
				type: "treemap",
				panel: true
			},
			dimension: "occupation",
			value: null,
			measure: "Salary Sum",
			axis_options: this.getProperty(properties, "axis"),
			size_options: []
			//size_options: this.getProperty(properties, "size")
		};

		this.handleChangeViz = this.handleChangeViz.bind(this);
		this.handleChangeAxis = this.handleChangeAxis.bind(this);
		this.handleChangeMeasure = this.handleChangeMeasure.bind(this);
		this.getKSAdata = this.getKSAdata.bind(this);
		this.handleFilterAdd = this.handleFilterAdd.bind(this);
		this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
		this.handleFilterRemove = this.handleFilterRemove.bind(this);

		this.getKSAdata(
			"Employee Records",
			this.state.dimension,
			this.state.measure
		);

		this.getDataOptions(
			"Employee Records",
			"occupation",
			"Salary Sum"
		).then(data =>
			this.setState({
				size_options: data
			})
		);
	}

	async getDataOptions(cubeName, dimension, measure) {
		let axis = await getData(cubeName, dimension, measure).promise;
		let data = axis[0].measures.map(item => item.name);
		// console.log(data);
		return data;
	}

	getKSAdata(cubeName, dimension, measure) {
		// Experiments
		getData(cubeName, dimension, measure).promise.then(data => {
			// console.log(data);
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
		// console.log(output);
		return output;
	}

	handleChangeAxis(event) {
		// console.log(event);
		this.setState({
			dimension: event.target.value
		});
		this.getKSAdata("Employee Records", event.target.value, this.state.measure);
	}

	handleChangeMeasure(event) {
		this.setState({
			measure: event.target.value
		});
		this.getKSAdata(
			"Employee Records",
			this.state.dimension,
			event.target.value
		);
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
		this.props.dispatch({ type: "FILTER_ADD", payload: defaultFilter() });
	}

	handleFilterUpdate(id, props) {
		this.props.dispatch({ type: "FILTER_UPDATE", payload: { ...props, _id: id } });
	}

	handleFilterRemove(index) {
		this.props.dispatch({ type: "FILTER_DELETE", payload: index });
	}

	renderFilters() {
		// let columns = Object.keys(this.state.data[0]);
		let columns = [];

		return this.props.filters.map(function(filter, idx) {
			return <Filter
				key={idx}
				columns={columns}
				property={filter.property}
				operator={filter.operator}
				value={filter.value}
				index={idx}
				onChange={this.handleFilterUpdate}
				onDelete={this.handleFilterRemove}
			/>
		}, this);
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
						{this.renderFilters.call(this)}
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
								data: applyFilters(this.state.data, this.props.filters || []),
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

function mapStateToProps(state) {
	return {
		filters: state.filters
	};
}

export default connect(mapStateToProps)(App);
// export default App;
