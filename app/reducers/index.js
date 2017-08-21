import dataReducer from "./data";
import filtersReducer from "./filters";
import optionsReducer from "./options";
import visualsReducer from "./visuals";

export default {
	data: dataReducer,
	filters: filtersReducer,
	visuals: visualsReducer,
	options: optionsReducer
};
