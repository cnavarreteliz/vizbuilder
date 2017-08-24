const initialState = {
	type: "treemap",
	groupBy: ["group", "name"],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_TYPE_UPDATE": {
			return { ...state, type: action.payload };
		}

		default:
			return state;
	}
}
