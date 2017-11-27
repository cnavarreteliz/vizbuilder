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

interface ChartsState {
	table: {
		attributes: Array<Object>,
		groupBy: any,
		sorted: Array<Object>
	}
}

interface VisualsState {
	chart: {
		type: string;
		time: Array<number>;
		buckets: number;
	};
	axis: {
		standard: {
			x: string;
			y: string;
			time: string;
		};
		bubble: {
			x: string;
			y: string;
			size: string;
			discrete: string;
		};
	};
	dialogPanel: {
		show: boolean;
	};
}

interface VizbuilderState {
	aggregators: AggregatorsState;
	charts: ChartsState;
	cubes: CubesState;
	data: DataState;
	filters: Array<Filter>;
	members: MembersState;
	visuals: VisualsState;
}
