import dataReducer from "./data";
import filtersReducer from "./filters";
import optionsReducer from "./options";
import visualsReducer from "./visuals";
import cubesReducer from "./cubes";
import aggregatorsReducer from "./aggregators";

export default {
	aggregators: aggregatorsReducer,
	cubes: cubesReducer,
	data: dataReducer,
	filters: filtersReducer,
	visuals: visualsReducer,
	options: optionsReducer
};
