const initialState = {
	type: "treemap",
	groupBy: ["group", "name"],
	axis: {
		x: null,
		y: null
	}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_TYPE_UPDATE": {
			return { ...state, type: action.payload };
		}

		case "VIZ_AXIS_UPDATE": {
			return {...state, axis: {...state.axis, [action.axis]: action.payload}};
		}

		default:
			return state;
	}
}
