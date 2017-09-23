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

export const config = {
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
	},
	xConfig: axisConfig,
	x2Config: { barConfig: axisConfig.barConfig },
	yConfig: axisConfig,
	y2Config: { barConfig: axisConfig.barConfig }
};
