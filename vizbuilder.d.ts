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

interface ChartType {
	key: string;
	name: string;
	nllabel: string;
	icon: string;
}

interface Filter {
	key: string;
	property: Level | Measure;
	operator: FilterOperatorNumber | FilterOperatorText;
	value: number | string | Array<Member>;
}

interface Selectable {
	name: string;
	value: any;
	disabled?: boolean;
}

declare class DataStructure implements Selectable {
	source: any;
	key: string;
	
	readonly fullName: string;
	readonly name: string;
	readonly value: any;
}

declare class Measure extends DataStructure {
	source: MondrianMeasure;
	key: string;
	
	kind: string;
	type: AggregatorType;

	constructor(item: MondrianMeasure);
	
	readonly fullName: string;
	readonly name: string;
	readonly value: Measure;
}

declare class Level extends DataStructure {
	source: MondrianLevel;
	key: string;
	
	kind: string;

	private _publicName: string;

	constructor(item: MondrianLevel);
	
	readonly fullName: string;
	readonly name: string;
	readonly value: Level;
	
	readonly levelName: string;
	readonly hierarchyName: string;
	readonly dimensionName: string;
	readonly dimensionType: DimensionType;
}

declare class Hierarchy extends DataStructure {
	source: MondrianHierarchy;
	key: string;
	
	kind: string;

	private _levels: Array<Level>;
	
	constructor(item: MondrianHierarchy);
	
	readonly fullName: string;
	readonly name: string;
	readonly value: Hierarchy;
	
	readonly levels: Array<Level>;
}

declare class Dimension extends DataStructure {
	source: MondrianDimension;
	key: string;
	
	kind: string;
	
	private _hierarchies: Array<Hierarchy>;	
	
	constructor(item: MondrianDimension);
	
	readonly fullName: string;
	readonly name: string;
	readonly value: Dimension;
	
	readonly type: DimensionType;
	readonly hierarchies: Array<Hierarchy>;
	readonly levels: Array<Level>;

	getLevelHierarchy(): Array<Selectable>;
}

declare class Cube extends DataStructure {
	source: MondrianCube;
	key: string;

	kind: string;

	private _dimensions: Array<Dimension>;
	private _levels: Array<Level>;
	private _measures: Array<Measure>;
	
	constructor(item: MondrianCube);
	
	readonly fullName: string;
	readonly name: string;
	readonly value: Cube;

	readonly query: MondrianQuery;
	readonly measures: Array<Measure>;
	readonly dimensions: Array<Dimension>;
	readonly stdDimensions: Array<Dimension>;
	readonly timeDimensions: Array<Dimension>;
	readonly levels: Array<Level>;
	readonly stdLevels: Array<Level>;
	readonly timeLevels: Array<Level>;

	getLevelHierarchy(): Array<Selectable>;
}
