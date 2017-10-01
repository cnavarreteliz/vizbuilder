import { FIRST_YEAR, LATEST_YEAR } from "helpers/consts";

const initialState = {
	panel: {
		show: false
	},
	chart: {
		type: "treemap",
		growth: false,
		colorBy: ''
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

		case "VIZ_COLORBY_SET": {
			return { ...state, chart: { ...state.chart, colorBy: action.payload } };
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
			let newState = {...state, axis: {...state.axis, x: action.payload.name }};

			switch (action.payload.name) {
				case "Age":
				case "Age Bucket":
					newState.chart.type = 'bar';
					break;

				default:
					newState.chart.type = 'treemap';
					break;
			}

			return newState;
		}

		case "MEASURE_SET": {
			return {...state, axis: {...state.axis, y: action.payload.name }}
		}

		default:
			return state;
	}
}
