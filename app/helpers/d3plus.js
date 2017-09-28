import { FORMATTERS } from "helpers/formatters";
import { isNumeric } from "helpers/functions";

const axisConfig = {
	barConfig: {
		stroke: "#aaaaaa",
		"stroke-width": 1,
		"stroke-opacity": 0.5
	},
	gridConfig: {
		stroke: "#aaaaaa",
		"stroke-width": 1,
		"stroke-opacity": 0.5
	},
	shapeConfig: {
		fill: "#979797",
		labelConfig: {
			fontColor: "rgba(0, 0, 0, 0.8)",
			fontFamily: () => "Pathway Gothic One"
		},
		stroke: "#aaaaaa",
		strokeOpacity: 0.5
	},
	titleConfig: {
		fontColor: "rgba(0, 0, 0, 0.8)"
	},
	tickSize: 0
};

export const CHARTCONFIG = {
	barPadding: 10,
	legendConfig: {
		marginLeft: 50,
		padding: 8,
		shapeConfig: {
			labelConfig: {
				fontColor: "rgba(0, 0, 0, 0.8)",
				fontFamily: () => "Pathway Gothic One",
				fontResize: false,
				fontSize: 12,
				fontWeight: 400
			},
			height: () => 25,
			width: () => 25
		},
		tooltipConfig: {
			body: false
		},
		legendConfig: {
			marginLeft: 50,
			padding: 8,
			shapeConfig: {
				labelConfig: {
					fontColor: "rgba(0, 0, 0, 0.8)",
					fontFamily: () => "Pathway Gothic One",
					fontResize: false,
					fontSize: 12,
					fontWeight: 400
				},
				height: () => 25,
				width: () => 25
			},
			tooltipConfig: {
				body: false
			}
		}
	},
	tooltipConfig: {
		padding: "10px",
		width: "200px",
		background: "white",
		title: d => d.id,
		titleStyle: {
			"font-size": "18px",
			"text-transform": "uppercase",
			"font-weight": "bold",
			"text-align": "center",
			"font-family": "Montserrat, sans-serif"
		},
		body(item) {
			item = item.source;
			return Object.keys(item).reduce(function(html, key) {
				let value = isNumeric(item[key])
					? abbreviateFormat(key, item[key])
					: item[key];
				html +=
					"<div class='tooltip-item'><div class='title'>" +
					key +
					"</div><div class='content'>" +
					value +
					"</div></div>";
				return html;
			}, "<div class='header-line'></div>");
		},
		bodyStyle: {
			"font-size": "16px"
		},
		footer: "",
		footerStyle: {
			"margin-top": 0
		}
	},
	xConfig: axisConfig,
	x2Config: { barConfig: axisConfig.barConfig },
	yConfig: axisConfig,
	y2Config: { barConfig: axisConfig.barConfig }
};

function abbreviateFormat(name, value) {
	if (name.includes("Salary")) {
		return FORMATTERS.dollarCommas(value);
	} else if (name === "Growth") {
		let span_class = value >= 0 ? "increase" : "decrease";
		value = FORMATTERS.share(value);
		return "<span class=" + span_class + ">" + value + "</span>";
	} else {
		return FORMATTERS.commas(value);
	}
}
