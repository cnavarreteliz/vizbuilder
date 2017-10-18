interface ReduxMessage<T> {
	type: string;
	payload: T;
	[x:string]: any;
}

interface AggregatorsState {
	measures: Array<Measure>;
	drilldowns: Array<Drillable>;
	groupBy: Array<Drillable>;
	colorBy: Array<Measure>;
	cuts: Array<any>;
}

interface CubesState {
	fetching: boolean;
	success: boolean;
	error: Error;

	all: Array<Cube>;
	current: Cube;
}

interface DataState {
	fetching: boolean;
	success: boolean;
	error: Error;

	values: Array<object>,
	axes: Array<any>,
	dimensions: Array<any>,
}

interface VisualsState {
	panel: {
		show: boolean;
	};
	chart: {
		type: string;
		growth: boolean;
	};
	axis: {
		x: string;
		y: string;
		year: string;
	};
	dialogPanel: {
		show: boolean;
	};
	buckets: number;
	timeDimension: boolean;
}

interface VizbuilderState {
	aggregators: AggregatorsState;
	cubes: CubesState;
	data: DataState;
	filters: Array<Filter>;
	visuals: VisualsState;
}
