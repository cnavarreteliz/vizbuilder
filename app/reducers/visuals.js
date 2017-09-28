import { FIRST_YEAR, LATEST_YEAR } from "helpers/consts";

const initialState = {
	panel: {
		show: false
	},
	chart: {
		type: "treemap",
		panel: "PANEL_TYPE_NORMAL",
		groupBy: ["group", "name"],
		colorScale: "",
		growth: false
	},
	axis: {
		x: '',
		y: '',
		year: ''
	},
	range: [ FIRST_YEAR, LATEST_YEAR ],
	buckets: 10,
	timeDimension: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_COLOR_UPDATE": {
			return { ...state, chart: { ...state.chart, colorScale: action.payload } };
		}

		case "VIZ_GROWTH_UPDATE": {
			return { ...state, chart: { ...state.chart, growth: action.payload } };
		}

		case "VIZ_TYPE_UPDATE": {
			return { ...state, chart: {...state.chart, type: action.payload, panel: action.panel} };
		}

		case "VIZ_TIMEDIMENSION_UPDATE": {
			return { ...state, timeDimension: action.payload };
		}

		case "VIZ_RANGE_UPDATE": {
			return { ...state, range: action.payload };
		}

		case "VIZ_BUCKET_UPDATE": {
			return { ...state, buckets: action.payload };
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

		case "DRILLDOWN_SET": {
			return {...state, axis: {...state.axis, x: action.payload.name }}
		}

		case "MEASURE_SET": {
			return {...state, axis: {...state.axis, y: action.payload.name }}
		}

		default:
			return state;
	}
}
