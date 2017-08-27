import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

export default function InputSelect(props) {
	let {cube} = props;

	return (
		<div className="input-wrapper input-select">
			<label className="pt-label">
				<span className="label-text">{label}</span>
				<div className="pt-select">
					<select
						value={value}
						onChange={evt => onChange(evt.target.value)}
					>
						{/* {options} */}
					</select>
				</div>
			</label>
		</div>
	);
}
