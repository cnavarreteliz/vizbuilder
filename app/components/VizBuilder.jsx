import React, { Component } from "react";
class VizBuilder extends Component {

    constructor () {
        super()
        this.getVizBuilderComponent = this.getVizBuilderComponent.bind(this)
    }

    getVizBuilderComponent(viz) {
        switch (viz.type) {
            case 'treemap':
                return <Treemap config={ viz.config } />;
            case 'donut':
                return <Donut config={ viz.config } />;
        }
    }

    render() {
        const options = this.props;
        return(
            this.getVizBuilderComponent(options)
        );
    }
}
export default VizBuilder;