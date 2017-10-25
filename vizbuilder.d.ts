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

enum FilterNumberOperator {
	EQUAL = 1,
	LOWER = 2,
	LOWEREQUAL = 3,
	HIGHER = 4,
	HIGHEREQUAL = 5,
	NOTEQUAL = 6
}
enum FilterTextOperator {
	EQUAL = 1,
	NOTEQUAL = 6,
	CONTAINS = 8
}

interface Filter {
	key: string;
	property: string;
	kind: string;
	operator: FilterNumberOperator | FilterTextOperator;
	value: number | string;
}

interface Selectable {
	key: string;
	label: string;
	value: Selectable;
	disabled?: boolean;
}

declare class Measure implements Selectable {
	kind: string;
	key: string;
	name: string;

	type: any;
}

declare class Level implements Selectable, Drillable {
	kind: string;
	key: string;
	name: string;

	dimensionType: number;
}

declare class Hierarchy {
	kind: string;
	key: string;
	name: string;

	drilldowns: Array<Drillable>;
}

declare class Dimension {
	kind: string;
	key: string;
	name: string;

	drilldowns: Array<Drillable>;
	getLevelHierarchy(): Array<Selectable>;
}

declare class Cube {
	kind: string;
	key: string;
	name: string;

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

	getLevelHierarchy(): Array<Selectable>;
}

declare class MondrianQuery {
	qs: string;

	getDrilldowns(): Array<Drillable>;
	getMeasures(): Array<Measure>;

	drilldown(dimension: string, hierarchy: string, level: string): MondrianQuery;
	measure(name: string): MondrianQuery;
	cut(member: string): MondrianQuery;
	option(): MondrianQuery;
}
declare class MondrianClient {}
declare class MondrianCube {
	findMeasure(name: string): Measure;
	findNamedSet(dimension: string): any;
	query: MondrianQuery;
}
