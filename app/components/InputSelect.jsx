function Select(props) {
	const options = [{ label: "Select..." }].concat(props.options);

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
					{options.map(opt =>
						<option value={opt.value || opt.label}>
							{opt.label}
						</option>
					)}
				</select>
			</div>
		</label>
	);
}

export default Select;
