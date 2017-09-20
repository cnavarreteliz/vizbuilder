import { makeRandomId } from "helpers/random";

export class Cube {
	constructor(cb) {
		this.key = makeRandomId();
		this.name = cb.name;
		this.query = cb.query;

		this.dimensions = []
			.concat(cb.dimensions)
			.filter(Boolean)
			.map(item => new Dimension(item));

		this.measures = []
			.concat(cb.measures)
			.filter(Boolean)
			.map(item => new Measure(item));

		this._drilldowns = null;
	}

	get stdDimensions() {
		return this.dimensions.filter(dim => dim.type === 0);
	}

	get timeDimensions() {
		return this.dimensions.filter(dim => dim.type === 1);
	}

	get drilldowns() {
		if (!this._drilldowns) {
			this._drilldowns = this.dimensions.reduce(function(all, dim) {
				return all.concat(dim.drilldowns);
			}, []);
		}

		return this._drilldowns;
	}
}

export class Dimension {
	constructor(dm) {
		this.key = makeRandomId();
		this.name = dm.name;
		this.type = dm.dimensionType;

		this.hierarchies = []
			.concat(dm.hierarchies)
			.filter(Boolean)
			.map(item => new Hierarchy(item));
	}

	get drilldowns() {
		return this.hierarchies.reduce(function(all, hr) {
			return all.concat(hr.drilldowns);
		}, []);
	}
}

export class Hierarchy {
	constructor(hr) {
		this.key = makeRandomId();
		this.name = hr.name || "";

		this.levels = []
			.concat(hr.levels)
			.filter(Boolean)
			.map(item => new Level(item));
	}

	get drilldowns() {
		let hierarchy = this.name;

		return this.levels.reduce(
			(all, lv, index) => (index > 0 ? all.concat(lv) : all),
			[]
		);
	}
}

export class Level {
	constructor(lv) {
		this.key = makeRandomId();
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
}

export class Measure {
	constructor(ms) {
		this.key = makeRandomId();
		this.name = ms.name;
	}
}