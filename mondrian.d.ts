interface Annotations {
	[s: string]: string;
}

interface Member {
	name: string;
	fullName: string;
	caption: string;
	allMember: boolean;
	drillable: boolean;
	depth: number;
	key: string;
	numChildren: number;
	parentName: string;
	children: Member[];
	ancestors: Member[];
	level?: Level;
}

declare enum AggregatorType {
	AVG = "AVG",
	COUNT = "COUNT",
	MAX = "MAX",
	MIN = "MIN",
	SUM = "SUM",
	UNKNOWN = "UNKNOWN"
}

declare enum DimensionType {
	Standard = 0,
	Time = 1
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
	name: string;
	caption: string;
	dimensions: Dimension[];
	namedSets: NamedSet[];
	measures: Measure[];
	annotations: Annotations;
	dimensionsByName: {
		[d: string]: Dimension;
	};

	readonly standardDimensions: Dimension[];
	readonly timeDimension: Dimension;
	readonly defaultMeasure: Measure;
	readonly query: MondrianQuery;

	findMeasure(name: string): Measure;
	findNamedSet(dimension: string): any;
}

declare class MondrianDimension {
	name: string;
	caption: string;
	dimensionType: DimensionType;
	annotations: Annotations;
	hierarchies: MondrianHierarchy[];
	cube: MondrianCube;

	getHierarchy(hierarchyName: string): MondrianHierarchy;
}

declare class MondrianHierarchy {
	name: string;
	allMemberName: string;
	levels: MondrianLevel[];
	dimension: MondrianDimension;

	getLevel(levelName: string): MondrianLevel;
}

declare class MondrianLevel {
	name: string;
	caption?: string;
	fullName: string;
	depth: number;
	annotations: Annotations;
	properties: string[];
	hierarchy: MondrianHierarchy;

	hasProperty(propertyName: string): boolean;
	membersPath(): string;
}

declare class MondrianMeasure {
	name: string;
	caption: string;
	fullName: string;
	annotations: Annotations;
	aggregatorType: AggregatorType;
}

declare class MondrianNamedSet {
	name: string;
	level: MondrianLevel;
	annotations: Annotations;
	readonly fullName: string;
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

	readonly qs: string;

	getDrilldowns(): Drillable[];
	getMeasures(): MondrianMeasure[];
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

declare type Drillable = MondrianNamedSet | MondrianLevel;
