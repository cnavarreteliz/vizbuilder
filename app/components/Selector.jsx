import React, { Component } from "react";
// Dinamic selector
class Selector extends Component {

    handleChange(event){
        var option = event.target.value;
        console.log(option)
        this.props.handleChange(option)
    }

    render() {
        const { callback, options, selected } = this.props;
        return (
            <select onChange={this.props.handleChange}>
                {options.map(opt =>
                    <option value={opt.id.toLowerCase()} type={opt.name.toLowerCase()}>{opt.name}</option>
                )}
            </select>
        );
    }
}

export default Selector;