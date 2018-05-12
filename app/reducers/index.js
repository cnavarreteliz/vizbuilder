import aggregatorsReducer from "./aggregators";
import chartsReducer from "./charts";
import cubesReducer from "./cubes";
import dataReducer from "./data";
import filtersReducer from "./filters";
import membersReducer from "./members";
import visualsReducer from "./visuals";

const initialState = {
	table: {
		attributes: [],
		groupBy: [],
		sorted: []
	}
};

export default {
	aggregators: aggregatorsReducer,
	charts: initialState,
	cubes: cubesReducer,
	data: dataReducer,
	filters: filtersReducer,
	members: membersReducer,
	visuals: visualsReducer
};
