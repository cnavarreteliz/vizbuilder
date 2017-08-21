export default function VizSelectorPanel(props) {
	return (
		<div className="panel">
			<label className="pt-label">
				{props.label}
				<div className="pt-select">
					<select
						id="axis-options"
						value={props.value}
						onChange={evt => props.onChange(evt.target.value)}
					>
						{props.options.map((filter, i) =>
							<option value={filter}>
								{filter}
							</option>
						)}
					</select>
				</div>
			</label>
		</div>
	);
}
