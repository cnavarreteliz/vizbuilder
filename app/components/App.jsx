import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@blueprintjs/core/dist/components/button/buttons.js";

import properties from "data/properties.json";
import dataCubes from "data/cubes.json";
import { getData } from "helpers/stats";

import Filter, { defaultFilter, applyFilters } from "components/Filter";

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
			dimension: "Occupation",
			value: null,
			measure: "Salary Sum",
			cubeName: "Employee Records",
			axis_options: [],
			cube_options: this.getProperty(dataCubes, "name"),
			defaultDimensions: this.getProperty(dataCubes, "defaultDimension"),
			//axis_options: this.getProperty(properties, "axis"),
			size_options: []
			//size_options: this.getProperty(properties, "size")
		};

		this.handleChangeViz = this.handleChangeViz.bind(this);
		this.handleChangeAxis = this.handleChangeAxis.bind(this);
		this.handleChangeCube = this.handleChangeCube.bind(this);
		this.handleChangeMeasure = this.handleChangeMeasure.bind(this);
		this.getKSAdata = this.getKSAdata.bind(this);

		this.getKSAdata(
			this.state.cubeName,
			this.state.dimension,
			this.state.measure
		);

		this.getDataOptions(
			this.state.cubeName,
			this.state.dimension,
			this.state.measure
		).then(data =>
			this.setState({
				size_options: data
			})
		);

		this.getDataOptions(
			this.state.cubeName,
			this.state.dimension,
			this.state.measure,
			"dimensions"
		).then(data =>
			this.setState({
				axis_options: data
			})
		);
	}

	async getDataOptions(cubeName, dimension, measure, key = "measures") {
		// Get promise
		let axis = await getData(cubeName, dimension, measure).promise;
		let data = axis[0][key].map(item => item.name);
		console.log(data);
		return data;
	}

	async getKSAdata(cubeName, dimension, measure) {
		let data = await getData(cubeName, dimension, measure).promise;
		console.log(data);

		let ksa_data = data[1].values.map((level1, i) => ({
			year: 2016,
			value: parseFloat(level1[0][0]),
			id: i + 1,
			name: data[1].axes[2].members[i].name,
			group: data[1].axes[2].members[i].name[0]
		}));

		this.props.onDataLoad(ksa_data);
	}

	getProperty(data, key) {
		return data.map(e => {
			return e[key];
		});
	}

	handleChangeAxis(event) {
		// console.log(event);
		this.setState({
			dimension: event.target.value
		});
		this.getKSAdata(
			this.state.cubeName,
			event.target.value,
			this.state.measure
		);
	}

	handleChangeCube(event) {
		this.setState({
			cubeName: event.target.value,
			dimension: this.state.defaultDimensions[
				this.state.cube_options.indexOf(event.target.value)
			]
		});
	}

	handleChangeMeasure(event) {
		this.setState({
			measure: event.target.value
		});
		this.getKSAdata(
			this.state.cubeName,
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

	renderFilters(props) {
		return props.filters.map(function(filter, idx) {
			return (
				<Filter
					key={filter._id}
					columns={props.dataColumns}
					property={filter.property}
					operator={filter.operator}
					value={filter.value}
					index={idx}
					onChange={props.onFilterUpdate}
					onDelete={props.onFilterRemove}
				/>
			);
		});
	}

	render() {
		return (
			<div className="wrapper">
				<div className="container">
					<div className="main-panel">
						<VizSelector
							handleChangeViz={this.handleChangeViz}
							handleChangeAxis={this.handleChangeAxis}
							handleChangeCube={this.handleChangeCube}
							handleChangeMeasure={this.handleChangeMeasure}
							config={this.state.viz}
							axis={this.state.axis_options}
							size_options={this.state.size_options}
							cube_options={this.state.cube_options}
							size={this.state.measure}
							cubeName={this.state.cubeName}
							dimension={this.state.dimension}
						/>
						{this.renderFilters(this.props)}
						<Button
							className="pt-fill"
							iconName="add"
							onClick={this.props.onFilterAdd}
						>
							Add filter
						</Button>
					</div>
					<div className="viz-wrapper">
						<VizBuilder
							title="Hello"
							config={{
								data: this.props.data,
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
		dataColumns: Object.keys(state.data.rawData[0] || {}),
		filters: state.filters
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onDataLoad(data) {
			dispatch({ type: "DATA_UPDATE", payload: data });
		},

		onFilterAdd() {
			dispatch({ type: "FILTER_ADD", payload: defaultFilter() });
		},

		onFilterUpdate(id, props) {
			dispatch({
				type: "FILTER_UPDATE",
				payload: { ...props, _id: id }
			});
		},

		onFilterRemove(index) {
			dispatch({ type: "FILTER_DELETE", payload: index });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
