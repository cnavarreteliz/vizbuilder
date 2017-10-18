import { makeRandomId } from "helpers/random";

/**
 * Reusable function to reduce drillable elements
 * @param {Array<Drillable>} all Reducer array
 * @param {Dimension|Hierarchy} item Element to extract
 * @returns {Array<Drillable>}
 */
function reduceDrilldowns(all, item) {
	return all.concat(item.drilldowns);
}

export class Cube {
	key = makeRandomId();
	_drilldowns = null;

	constructor(cb) {
		this.name = cb.name;

		this.dimensions = []
			.concat(cb.dimensions)
			.filter(Boolean)
			.map(item => new Dimension(item));

		this.measures = []
			.concat(cb.measures)
			.filter(Boolean)
			.map(item => new Measure(item));

		this._source = cb;
	}

	get label() {
		return this.name;
	}

	get value() {
		return this;
	}

	get query() {
		return this._source.query;
	}

	get stdDimensions() {
		return this.dimensions.filter(dim => dim.type === 0);
	}

	get timeDimensions() {
		return this.dimensions.filter(dim => dim.type === 1);
	}

	get drilldowns() {
		if (!this._drilldowns)
			this._drilldowns = this.dimensions.reduce(reduceDrilldowns, []);

		return this._drilldowns;
	}

	get stdDrilldowns() {
		return this.stdDimensions.reduce(reduceDrilldowns, []);
	}

	get timeDrilldowns() {
		return this.timeDimensions.reduce(reduceDrilldowns, []);
	}

	getLevelHierarchy() {
		return this.dimensions.reduce(function(all, dim) {
			return all.concat(dim.getLevelHierarchy());
		}, []);
	}
}

export class Dimension {
	key = makeRandomId();

	constructor(dm) {
		this.name = dm.name;
		this.type = dm.dimensionType;

		this.hierarchies = []
			.concat(dm.hierarchies)
			.filter(Boolean)
			.map(item => new Hierarchy(item));
	}

	get label() {
		return this.name;
	}

	get value() {
		return this;
	}

	get drilldowns() {
		return this.hierarchies.reduce(reduceDrilldowns, []);
	}

	getLevelHierarchy() {
		return this.hierarchies.reduce((all, hr) => {
			let levels = hr.levels.slice(1);

			if (levels.length > 1) {
				all.push({
					key: hr.key,
					label: hr.name,
					value: levels.map(lv => ({ key: lv.key, label: lv.level, value: lv }))
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

export class Hierarchy {
	key = makeRandomId();

	constructor(hr) {
		this.name = hr.name || "";

		this.levels = []
			.concat(hr.levels)
			.filter(Boolean)
			.map(item => new Level(item));
	}

	get label() {
		return this.name;
	}

	get value() {
		return this;
	}

	get drilldowns() {
		return this.levels.reduce(
			/**
			 * @param {Array<Level>} all Reduce array
			 * @param {Level} lv Current level element
			 * @param {number} index Current index of the element
			 */
			(all, lv, index) => (index > 0 ? all.concat(lv) : all),
			[]
		);
	}
}

export class Level {
	key = makeRandomId();

	constructor(lv) {
		this.level = lv.name || "";

		this.hierarchy = lv.hierarchy.name || "";

		this.dimension = lv.hierarchy.dimension.name || "";
		this.dimensionType = lv.hierarchy.dimension.dimensionType;

		if (this.hierarchy.includes(this.level)) {
			this.name = this.hierarchy;
		} else if (
			this.level !== this.hierarchy &&
			!this.level.includes(this.hierarchy)
		) {
			this.name = `${this.level} (${this.hierarchy})`;
		} else {
			this.name = this.level;
		}
	}

	get label() {
		return this.name;
	}

	get value() {
		return this;
	}
}

export class Measure {
	key = makeRandomId();

	constructor(ms) {
		this.name = ms.name;
		this.type = ms.aggregatorType;
	}

	get label() {
		return this.name;
	}

	get value() {
		return this;
	}
}
