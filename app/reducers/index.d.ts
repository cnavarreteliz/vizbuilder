interface ReduxMessage<T> {
	type: string;
	payload: T;
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
	s: boolean;
}

