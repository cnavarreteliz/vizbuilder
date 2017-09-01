const initialState = {
	type: "treemap",
	panel: "PANEL_TYPE_NORMAL",
	groupBy: ["group", "name"],
	axis: {
		x: '',
		y: '',
		year: ''
	}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_TYPE_UPDATE": {
			return { ...state, type: action.payload, panel: action.panel };
		}

		case "VIZ_AXIS_UPDATE": {
			return {...state, axis: {...state.axis, [action.axis]: action.payload}};
		}

		default:
			return state;
	}
}
