import PropTypes from 'prop-types';

function Select(props) {
	const options = [].concat(props.options || []);

	return (
		<label className="pt-label">
			<span>
				{props.title}
			</span>
			<div className="pt-select">
				<select
					value={props.value}
					disabled={props.options.length == 0 || props.disabled}
					onChange={props.onChange}
				>
					<option>Select...</option>
					{options.map(opt =>
						<option value={opt.value}>
							{opt.label || opt.value}
						</option>
					)}
				</select>
			</div>
		</label>
	);
}

Select.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	onChange: PropTypes.func,
	title: PropTypes.string,
	disabled: PropTypes.bool,
}

Select.defaultProps = {
	title: '',
	disabled: false,
}

export default Select;
