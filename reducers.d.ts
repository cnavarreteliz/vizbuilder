interface ReduxMessage<T> {
	type: string;
	payload?: T;
	[x: string]: any;
}

interface AggregatorsState {
	measures: Array<Measure>;
	drilldowns: Array<Level>;
	cuts: {
		[fullName: string]: Cut
	};
	groupBy: Array<Level>;
	colorBy: Array<Measure>;
	growthBy: Array<Measure>;
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
	success: null | boolean;
	error: null | Error;

	values: Array<{ [x: string]: string }>;
	axis: {
		x: any;
		y: any;
		time: any;
	};
	dimensions: Array<any>;
	filters: {
		type: string;
		options: Array;
	};
}

interface MembersState {
	loading: boolean;
	[x]: Array<Member>;
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
	members: MembersState;
	visuals: VisualsState;
}
