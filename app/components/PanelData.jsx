import { Component, createElement } from "react";

class PanelData extends Component {
    render() {
        const props = this.props
        const keys = Object.keys(props.data[0] || {});

        return(
            <div>{keys[0]}</div>
        );
    }
}

export default PanelData;    