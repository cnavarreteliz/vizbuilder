import { format, formatPrefix } from "d3-format";
import { timeFormat } from "d3-time-format";

export function intersperse(arr, sep) {
	if (arr.length === 0) {
		return [];
	}

	const result = arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
	if (result.length <= 1) {
		return result;
	} else {
		return [...result.slice(0, -1), "and", " ", ...result.slice(-1)];
	}
}

function round2(d) {
	if (d === undefined || d === null) return "N/A";
	return formatPrefix(",.2", d)(d).replace("G", "B");
}

export function abbreviate(n, forceRounding = false) {
	if (n === undefined || n === null) return "N/A";

	const length = n.toString().split(".")[0].length;

	if (n === 0) return "0";
	else if (length > 3) return formatPrefix(",.2", n)(n).replace("G", "B");
	else if (length === 3) return format(`,${forceRounding ? ".0" : ""}f`)(n);
	else if (n === parseInt(n, 10)) return format(".2")(n);
	else return format(".3g")(n);
}

export const FORMATTERS = {
	commas: format(","),
	date: timeFormat("%B %d, %Y"),
	ordinal: (n) => {
		if (n > 3 && n < 21) return `${n}th`; // thanks kennebec
		switch (n % 10) {
			case 1:
				return `${n}st`;
			case 2:
				return `${n}nd`;
			case 3:
				return `${n}rd`;
			default:
				return `${n}th`;
		}
	},
	dollarCommas: (d) => `$${format(",")(d)}`,
	ratio: (d) => format(".2%")(d / 100),
	round2,
	round: format(",.0f"),
	share: format(".2%"),
	shareWhole: format(".0%"),
	year: (y) => (y < 0 ? `${Math.abs(y)} BC` : y)
};
