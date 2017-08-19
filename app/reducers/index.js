import { combineReducers } from "redux";

import filtersReducer from "./filtersReducer";

export default combineReducers({
	filters: filtersReducer
});
