import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@blueprintjs/core/dist/components/button/buttons.js";

import properties from "data/properties.json";
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
		return data;
	}

	async getKSAdata(cubeName, dimension, measure) {
		let data = await getData(cubeName, dimension, measure).promise;

		let ksa_data = data[1].values.map((level1, i) => ({
			year: 2016,
			value: parseFloat(level1[0][0]),
			id: i + 1,
			name: data[1].axes[2].members[i].name,
			group: data[1].axes[2].members[i].name[0]
		}));

		this.props.onDataLoad(ksa_data);
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
							handleChangeMeasure={this.handleChangeMeasure}
							config={this.state.viz}
							axis={this.state.axis_options}
							size_options={this.state.size_options}
							size={this.state.measure}
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
