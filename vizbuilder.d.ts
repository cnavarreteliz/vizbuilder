interface ChartType {
	key: string;
	name: string;
	nllabel: string;
	icon: string;
}

interface Drillable {
	level: string;
	hierarchy: string;
	dimension: string;
}

interface Filter {
	operator: number;
	property: string;
	value: string | number;
}

interface Selectable {
	label: string;
	value: Selectable;
}

declare class DataFragment implements Selectable {
	key: string;
	name: string;
}

declare class Measure extends DataFragment {
	aggregator: any;
}

declare class Level extends DataFragment implements Drillable {
	dimensionType: number;
}

declare class Hierarchy extends DataFragment {
	drilldowns: Array<Drillable>;
}

declare class Dimension extends DataFragment {
	drilldowns: Array<Drillable>;
}

declare class Cube extends DataFragment {
	dimensions: Array<Dimension>;
	measures: Array<Measure>;
	drilldowns: Array<Drillable>;
	query: MondrianQuery;
	_drilldowns: Array<Drillable>;
	_source: MondrianCube;
}

declare class MondrianQuery {
	measure(name: string): MondrianQuery;
	drilldown(dimension: string, hierarchy: string, level: string): MondrianQuery;
}
declare class MondrianClient {}
declare class MondrianCube {
	query: MondrianQuery;
}
