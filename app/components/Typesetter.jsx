import React from "react";

class Typesetter extends React.Component {
	constructor(props) {
		super(props);

		this.timer = null;
		this.state = {
			shown: ""
		};

		this.type = this.type.bind(this);
	}

	componentDidMount() {
		this.type();
	}

	componentDidUpdate(prev) {
		if (prev.text != this.props.text) {
			clearTimeout(this.timer);
			this.setState({ shown: "" });
			this.type();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		return <span className={this.props.className}>{this.state.shown}</span>;
	}

	type() {
		let newtext = this.props.text.substr(0, this.state.shown.length + 1);
		if (this.state.shown !== newtext) {
			this.setState({ shown: newtext });
			this.timer = setTimeout(this.type, 150 - Math.random() * 140);
		}
	}
}

export default Typesetter;
