import { Component, createElement } from "react";

import "styles/PanelInfo.css";

class PanelInfo extends Component {
	render() {
		const props = this.props;
		return (
			<div className="panelinfo-wrapper">
				<h4 className="title">
                    {this.prepareInfoPanel(props.data, props.axis.y, props.axis.x)}
                </h4>
				<p className="subtitle">Most Common {props.axis.x} by {props.axis.y}</p>
				<p className="content">
					In 2005, the crop with the highest production value in Kenya was
					Tropical Fruit , with a value of Intl $438.89M.
				</p>
			</div>
		);
	}

	prepareInfoPanel(data, ms, dm) {
        const sortdata = data.sort((a, b) => {
            return b[ms] - a[ms];
        });
        console.log(sortdata)
        return sortdata[0][dm]
	}
}

export default PanelInfo;
