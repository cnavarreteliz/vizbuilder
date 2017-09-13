import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import WordCloud from "react-d3-cloud";

import { applyFilters } from "components/FilterItem";
import PanelTable from "components/PanelTable";

import "styles/PanelChart.css";

function PanelChart(props) {
	var data = [
		{
			title: "D3plus Tooltip",
			body: "Check out this cool table:",
			x: 100,
			y: 120,
			label: "Position"
		}
	];

	let tooltip = <Tooltip 
		data={data}
		thead={["Axis", function(d) {return d.label}]}
	/>
	
	let config = {
		type: props.chart.type,
		data: props.data,
		title: props.title,
		colorScale: "colorScale",
		colorScaleConfig: { color: ["#88B0D8", "#3F51B5"] },
		shapeConfig: { fontFamily: "Fira Sans Condensed" },
		tooltipConfig: {
			background: "white",
			//body: d => d.value,
			footer: "",
			width: "200px",
			footerStyle: {
			  "margin-top": 0
			},
			bodyStyle: {
				"font-size": "14px"
			},
			titleStyle: {
				"font-size": "14px",
				"text-transform": "uppercase",
				"font-weight": "bold",
				"font-family": "'Palanquin', sans-serif",
				"margin-bottom": "12px"
			},
			tbody:[
				["Salary Sum", d => d.value],
				//["Other", "Test value"]
			],
			padding: "10px",
			title: d => d.name
		},
		// groupBy: props.groupBy
	};

	switch (config.type) {
		case "treemap":
			return <Treemap config={config} />;

		case "donut":
			return <Donut config={config} />;

		case "pie":
			return <Pie config={config} />;

		case "bubble":
			return <BarChart config={config} />;

		case "table":
			return <PanelTable data={props.bulk} />;

		case "bar":
			return <BarChart config={config} />;

		case "wordcloud":
			config.data = config.data.map(obj => ({
				text: obj.id,
				value: obj.value
			}));

			const fontSizeMapper = word => Math.log2(word.value) * 5;
			const rotate = word => (Math.random() * 6 - 3) * 30;

			return (
				<WordCloud
					data={config.data}
					fontSizeMapper={fontSizeMapper}
					//rotate={rotate}
				/>
			);
		case "stacked":
			return <StackedArea config={config} />;

		default:
			return <div />;
	}
}

function mapDataChart(data, chart, props) {
	switch (chart.panel) {
		case "PANEL_TYPE_NORMAL":
			console.log(data);
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				value: item[props.y],
				colorScale: item[chart.colorScale]
			}));
		case "PANEL_TYPE_2D":
			return data.map(item => ({
				id: item[props.x],
				name: item[props.x],
				y: item[props.y],
				x: item[props.year],
				colorScale: item[chart.colorScale]
			}));
	}
}

function mapStateToProps(state) {
	let props = state.visuals.axis,
		chart = state.visuals.chart,
		data = applyFilters(state.data.values, state.filters);

	return {
		chart: chart,
		data: mapDataChart(data, chart, props),
		bulk: state.data.values
	};
}

export default connect(mapStateToProps)(PanelChart);
