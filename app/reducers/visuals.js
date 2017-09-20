const initialState = {
	panel: {
		show: false
	},
	chart: {
		type: "treemap",
		panel: "PANEL_TYPE_NORMAL",
		groupBy: ["group", "name"],
		colorScale: "",
	},
	axis: {
		x: '',
		y: '',
		year: ''
	}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_COLOR_UPDATE": {
			return { ...state, chart: { ...state.chart, colorScale: action.payload } };
		}

		case "VIZ_TYPE_UPDATE": {
			return { ...state, chart: {...state.chart, type: action.payload, panel: action.panel} };
		}

		case "VIZ_PANEL_TOGGLE": {
			return { ...state, panel: {...state.panel, show: action.payload} };
		}

		case "VIZ_AXIS_UPDATE": {
			return {...state, axis: {...state.axis, [action.axis]: action.payload}};
		}

		case "VIZ_FULL_UPDATE": {
			return {...state, axis: {...state.axis, x: action.dimension, y: action.measure } };
		}

		default:
			return state;
	}
}
