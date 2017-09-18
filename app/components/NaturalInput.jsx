import {connect} from 'react-redux'

function toOptionElement(item) {
    return <option value={item.value}>{item.label || item.value}</option>
}

function NaturalInput(props) {
	return (
		<div className="natural-input">
			<span className="static">From </span>
			<select>{props.cubes.map(toOptionElement)}</select>
			<span className="static">, show me </span>
			<select>{props.cubes.map(toOptionElement)}</select>
			<span className="static"> against </span>
			<select>{props.cubes.map(toOptionElement)}</select>
			<span className="static"> in </span>
			<select>{props.cubes.map(toOptionElement)}</select>
		</div>
	);
}

function mapStateToProps(state) {
    return {
        cubes: state.cubes.all.map(cube => cube.name)
    }
}

export default connect(mapStateToProps)(NaturalInput);