import { unique } from "shorthash";
import { makeRandomId } from "helpers/random";

/**
 * Reusable function to reduce drillable elements
 * @param {Array<Drillable>} all Reducer array
 * @param {Dimension|Hierarchy} item Element to extract
 * @returns {Array<Drillable>}
 */
const reduceDrilldowns = (all, item) => all.concat(item.levels);

class DataStructure {
	constructor(item) {
		this.source = item;
		this.key = unique(item.fullName || item.name);
	}

	get fullName() {
		return this.source.fullName;
	}

	get name() {
		return this.source.name;
	}

	get value() {
		return this;
	}
}

export class Cube extends DataStructure {
	kind = "cube";

	_measures = [];
	_dimensions = [];
	_levels = [];

	get query() {
		return this.source.query;
	}

	get measures() {
		if (!this._measures.length)
			this._measures = this.source.measures.map((item) => new Measure(item));

		return this._measures;
	}

	get dimensions() {
		if (!this._dimensions.length)
			this._dimensions = this.source.dimensions.map((item) => new Dimension(item));

		return this._dimensions;
	}

	get stdDimensions() {
		return this.dimensions.filter((dim) => dim.type === 0);
	}

	get timeDimensions() {
		return this.dimensions.filter((dim) => dim.type === 1);
	}

	get levels() {
		if (!this._levels.length) this._levels = this.dimensions.reduce(reduceDrilldowns, []);

		return this._levels;
	}

	get stdLevels() {
		return this.stdDimensions.reduce(reduceDrilldowns, []);
	}

	get timeLevels() {
		return this.timeDimensions.reduce(reduceDrilldowns, []);
	}

	getLevelHierarchy() {
		return this.dimensions.reduce(function(all, dim) {
			return all.concat(dim.getLevelHierarchy());
		}, []);
	}
}

export class Dimension extends DataStructure {
	kind = "dimension";

	_hierarchies = [];

	get type() {
		return this.source.dimensionType;
	}

	get hierarchies() {
		if (!this._hierarchies.length)
			this._hierarchies = this.source.hierarchies.map((h) => new Hierarchy(h));

		return this._hierarchies;
	}

	get levels() {
		return this.hierarchies.reduce(reduceDrilldowns, []);
	}

	getLevelHierarchy() {
		return this.hierarchies.reduce((all, hr) => {
			let levels = hr.levels.slice(1);

			if (levels.length > 1) {
				all.push({
					key: hr.key,
					label: hr.name,
					value: levels.map((lv) => ({ key: lv.key, label: lv.level, value: lv }))
				});
			} else if (levels.length === 1) {
				let level = levels[0];
				all.push({
					key: level.key,
					label: level.name,
					value: level
				});
			}

			return all;
		}, []);
	}
}

export class Hierarchy extends DataStructure {
	kind = "hierarchy";

	_levels = [];

	get levels() {
		if (!this._levels.length)
			this._levels = this.source.levels
				.filter((item, index) => index > 0)
				.map((item) => new Level(item));

		return this._levels;
	}
}

export class Level extends DataStructure {
	kind = "level";
	_publicName = "";

	constructor(item) {
		super(item);

		let lv_name = RegExp(item.name, "i"),
			hr_name = RegExp(this.hierarchyName, "i");

		if (lv_name.test(this.hierarchyName)) {
			this._publicName = this.hierarchyName;
		} else if (hr_name.test(item.name)) {
			let level = item.name.replace(hr_name, "").trim();
			this._publicName = `${this.hierarchyName} > ${level}`;
		} else {
			this._publicName = item.name;
		}
	}

	get name() {
		return this._publicName;
	}

	get levelName() {
		return this.source.name;
	}

	get hierarchyName() {
		return this.source.hierarchy.name;
	}

	get dimensionName() {
		return this.source.hierarchy.dimension.name;
	}

	get dimensionType() {
		return this.source.hierarchy.dimension.dimensionType;
	}
}

export class Measure extends DataStructure {
	kind = "measure";

	get type() {
		return this.source.aggregatorType;
	}
}
