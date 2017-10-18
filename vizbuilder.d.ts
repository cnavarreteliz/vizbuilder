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
	getLevelHierarchy(): Array<{ key: string; label: string; value: object }>;
}

declare class Cube extends DataFragment {
	_drilldowns: Array<Drillable>;
	_source: MondrianCube;

	query: MondrianQuery;
	measures: Array<Measure>;
	
	dimensions: Array<Dimension>;
	stdDimensions: Array<Dimension>;
	timeDimensions: Array<Dimension>;
	
	drilldowns: Array<Drillable>;
	stdDrilldowns: Array<Drillable>;
	timeDrilldowns: Array<Drillable>;
	
	getLevelHierarchy(): Array<{ key: string; label: string; value: object }>;
}

declare class MondrianQuery {
	measure(name: string): MondrianQuery;
	drilldown(dimension: string, hierarchy: string, level: string): MondrianQuery;
}
declare class MondrianClient {}
declare class MondrianCube {
	query: MondrianQuery;
}
