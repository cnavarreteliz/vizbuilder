import dataReducer from "./data";
import filtersReducer from "./filters";
import visualsReducer from "./visuals";
import cubesReducer from "./cubes";
import aggregatorsReducer from "./aggregators";

export default {
	aggregators: aggregatorsReducer,
	cubes: cubesReducer,
	data: dataReducer,
	filters: filtersReducer,
	visuals: visualsReducer
};
