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
			fontFamily: () => "Work Sans"
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
	legendConfig: {
		marginLeft: 50,
		padding: 8,
		shapeConfig: {
			labelConfig: {
				fontColor: "rgba(0, 0, 0, 0.8)",
				fontFamily: () => "Work Sans",
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
					fontFamily: () => "Work Sans",
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
		title: d => d.name,
		titleStyle: {
			"font-size": "18px",
			"text-transform": "uppercase",
			"font-weight": "bold",
			"font-family": "'Pathway Gothic One', sans-serif",
			"margin-bottom": "12px"
		},
		body(item) {
			item = item.source;
			return Object.keys(item).reduce(function(html, key) {
				let value = isNumeric(item[key])
					? item[key]
					: item[key];
				html += "<div class='tooltip-row'>" + key + ": " + value + "</div>";
				return html;
			}, "");
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

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function abbreviateNumber(num, fixed = 0) {
	if (num === null) {
		return null;
	} // terminate early
	if (num === 0) {
		return "0";
	} // terminate early
	fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
	var b = num.toPrecision(2).split("e"), // get power
		k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
		c =
			k < 1
				? num.toFixed(0 + fixed)
				: (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
		d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
		e = d + ["", "K", "M", "B", "T"][k]; // append power
	return e;
}
