export default function AssistantPanel(props) {
	return (
		<div className="panel">
			<div href="" onClick={props.onClick(props.measure)}>{props.title}</div>
		</div>
	);
}