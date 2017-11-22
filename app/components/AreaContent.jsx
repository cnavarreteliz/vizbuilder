import React from "react";
import { connect } from "react-redux";

import { applyFilters } from "helpers/filters";

import Chart from "components/Chart";
import AgeBucket from "components/Bucket";
import ContentDefault from "components/ContentDefault";
import InputPopover from "components/InputPopover";
import Toolbar from "components/Toolbar";
import BrowsingHistory from "components/BrowsingHistory";

import concat from "lodash/concat";

import { Button, Dialog } from "@blueprintjs/core";

import "styles/AreaContent.css";

/**
 * @typedef AreaContentProps
 * @prop {object} axis The current axis' labels.
 * @prop {Cube} cube The current Cube.
 * @prop {Array} data The raw dataset.
 * @prop {(ms: Measure) => void} onMeasureChange
 * @prop {(evt: Event) => void} onBucketUpdate
 * @prop {(lv: Level) => void} onLevelChange
 */

/**
 * @typedef AreaContentState
 * @prop {boolean} dialogOpen
 */

/** @augments {React.Component<AreaContentProps, AreaContentState>} */
class AreaContent extends React.Component {
	state = {
		dialogOpen: false,
		history:
			concat([], JSON.parse(localStorage.getItem("vizbuilder-history"))).filter(
				Boolean
			) || []
	};

	render() {
		const { axis, cube, data } = this.props;

		if (!axis.x || !axis.y) return <ContentDefault />;

		return (
			<div className="main-panel">
				<header className="header">
					<Toolbar
						data={data}
						cube={cube.name}
						axis={axis}
						queryString={this.props.queryString}
					/>
					<div className="title-wrapper">
						<p className="title">
							{cube.name + " by "}
							<InputPopover
								value={axis.x}
								options={cube.levels}
								onClick={this.props.onLevelChange}
							/>
						</p>

						<p className="subtitle">
							{"SIZED BY "}
							<InputPopover
								value={axis.y}
								options={cube.measures}
								onClick={this.props.onMeasureChange}
							/>
						</p>
					</div>

					<div className="wrapper-history" onClick={this.toggleDialog}>
						<div className="history-size">
							{this.state.history.length}
						</div>
						<Button
							className="filter-action remove pt-intent-danger pt-minimal"
							iconName="history"
						/>
						<Dialog
							iconName="pt-icon-history"
							isOpen={this.state.dialogOpen}
							onClose={this.toggleDialog}
							title={"My History"}
						>
							<div className="pt-dialog-body">
								<BrowsingHistory />
							</div>
						</Dialog>
					</div>
				</header>
				<Chart data={data} />
				<div className="chartappearance-wrapper">
					<AgeBucket />
				</div>
			</div>
		);
	}

	toggleDialog = () => {
		this.setState(state => ({ dialogOpen: !state.dialogOpen }));
	};
}

/** @param {VizbuilderState} state */
function mapStateToProps(state) {
	let dd = state.aggregators.drilldowns[0] || { name: "" },
		ms = state.aggregators.measures[0] || { name: "" };

	return {
		axis: {
			...state.visuals.axis,
			x: dd.name,
			y: ms.name
		},
		cube: state.cubes.current,
		data: applyFilters(state.data.values, state.filters)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onBucketUpdate(evt) {
			dispatch({ type: "VIZ_BUCKET_UPDATE", payload: evt.target.value });
		},

		onLevelChange(level) {
			dispatch({ type: "DRILLDOWN_SET", payload: level });
		},

		onMeasureChange(measure) {
			dispatch({ type: "MEASURE_SET", payload: measure });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaContent);
