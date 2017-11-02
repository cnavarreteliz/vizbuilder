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

interface Cut {
	level: Level;
	members: Array<MondrianMember>;
}

enum FilterOperatorNumber {
	EQUAL = 1,
	LOWER = 2,
	LOWEREQUAL = 3,
	HIGHER = 4,
	HIGHEREQUAL = 5,
	NOTEQUAL = 6
}
enum FilterOperatorText {
	EQUAL = 1,
	NOTEQUAL = 6,
	CONTAINS = 8
}
interface Filter {
	key: string;
	property: Level | Measure;
	operator: FilterOperatorNumber | FilterOperatorText;
	value: number | string | Array<any>;
}

interface Selectable {
	key: string;
	readonly label: string;
	readonly value: Selectable;
	disabled?: boolean;
}

declare class Measure implements Selectable {
	key: string;
	kind: string;
	name: string;
	type: any;

	readonly label: string;
	readonly value: Measure;
}

declare class Level implements Selectable, Drillable {
	key: string;
	kind: string;
	name: string;
	fullName: string;
	level: string;
	hierarchy: string;
	dimension: string;
	dimensionType: number;

	readonly label: string;
	readonly value: Level;
}

declare class Hierarchy implements Selectable {
	key: string;
	kind: string;
	name: string;
	levels: Array<Level>;

	readonly label: string;
	readonly value: Hierarchy;
	readonly drilldowns: Array<Level>;
}

declare class Dimension implements Selectable {
	key: string;
	kind: string;
	name: string;
	type: number;
	hierarchies: Array<Hierarchy>;

	readonly label: string;
	readonly value: Dimension;
	readonly drilldowns: Array<Level>;

	getLevelHierarchy(): Array<Selectable>;
}

declare class Cube implements Selectable {
	_drilldowns: Array<Level>;
	_source: MondrianCube;

	key: string;
	kind: string;
	name: string;
	dimensions: Array<Dimension>;
	measures: Array<Measure>;

	readonly query: MondrianQuery;
	readonly stdDimensions: Array<Dimension>;
	readonly timeDimensions: Array<Dimension>;
	readonly drilldowns: Array<Level>;
	readonly stdDrilldowns: Array<Level>;
	readonly timeDrilldowns: Array<Level>;

	getLevelHierarchy(): Array<Selectable>;
}

declare class MondrianQuery {
	cube: MondrianCube;
	private measures;
	private drilldowns;
	private cuts;
	private properties;
	private captions;
	options: {
		[opt: string]: boolean;
	};

	constructor(cube: MondrianCube);

	readonly qs: string;

	getDrilldowns(): Drillable[];
	getMeasures(): Measure[];
	drilldown(...parts: string[]): MondrianQuery;
	measure(measureName: string): MondrianQuery;
	cut(member: string): MondrianQuery;
	property(...parts: string[]): MondrianQuery;
	caption(...parts: string[]): MondrianQuery;
	option(option: string, value: boolean): MondrianQuery;
	path(format?: string): string;
	private getLevel(...parts);
	private getProperty(...parts);
}
declare class MondrianClient {
	private api_base;
	private cubesCache;

	constructor(api_base: string);

	cubes(): Promise<MondrianCube[]>;
	cube(name: string): Promise<MondrianCube>;
	query(
		query: MondrianQuery,
		format?: string,
		method?: string
	): Promise<Aggregation>;
	members(
		level: Level,
		getChildren?: boolean,
		caption?: string
	): Promise<Member[]>;
	member(
		level: Level,
		key: string,
		getChildren?: boolean,
		caption?: string
	): Promise<Member>;
}

declare class MondrianCube {
	static fromJSON(json: {}): MondrianCube;

	name: string;
	caption: string;
	dimensions: Dimension[];
	namedSets: NamedSet[];
	measures: Measure[];
	annotations: Annotations;
	dimensionsByName: {
		[d: string]: Dimension;
	};

	constructor(
		name: string,
		dimensions: Dimension[],
		namedSets: NamedSet[],
		measures: Measure[],
		annotations: Annotations
	);

	readonly standardDimensions: Dimension[];
	readonly timeDimension: Dimension;
	readonly defaultMeasure: Measure;
	readonly query: MondrianQuery;

	findMeasure(name: string): Measure;
	findNamedSet(dimension: string): any;
}

interface MondrianMember {
	level: Level;
	allMember: boolean;
	caption: string;
	depth: number;
	drillable: boolean;
	fullName: string;
	key: number | string;
	name: string;
	numChildren: number;
	parentName: string;
}