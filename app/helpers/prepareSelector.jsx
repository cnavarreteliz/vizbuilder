import { prepareHierarchy } from "helpers/prepareHierarchy";
import PanelFilters from "components/PanelFilters";
import {
	Button,
	Menu,
	MenuItem,
	Popover,
	Position,
	Switch,
	Tag
} from "@blueprintjs/core";
import InputSelect from "components/InputSelect";
import InputSelectPopover from "components/InputSelectPopover";

export function renderDrilldownSelector(props) {
    let { cube, drilldowns, onDrilldownAdd, onDrilldownDelete } = props;

    if (!cube.dimensions) return null;

    let menu = prepareHierarchy(cube.dimensions);

    let applied = drilldowns.map(dim => (
        <Tag key={dim.fullName} onRemove={() => onDrilldownDelete(dim)}>
            {dim.hierarchy.dimension.name == dim.name ? (
                dim.name
            ) : (
                dim.hierarchy.dimension.name + " > " + dim.name
            )}
        </Tag>
    ));

    return (
        <InputSelectPopover
            label="Serie"
            menu={menu}
            active={applied}
            onClick={onDrilldownAdd}
        />
    );
}

export function renderCutSelector(props) {
    let { cube, cuts, onCutAdd, onCutDelete } = props;

    if (!cube.dimensions) return null;

    let menu = prepareHierarchy(cube.dimensions);

    let applied = Object.keys(cuts)
        .map(key => cuts[key])
        .map(cut => (
            <Popover content={"ASDF"} position={Position.LEFT_TOP}>
                <Tag
                    key={cut.dim.fullName}
                    onRemove={() => onCutDelete(cut.dim.fullName)}
                >
                    {cut.dim.hierarchy.dimension.name == cut.dim.name ? (
                        cut.dim.name
                    ) : (
                        cut.dim.hierarchy.dimension.name + " / " + cut.dim.name
                    )}
                </Tag>
            </Popover>
        ));

    return (
        <InputSelectPopover
            label="Cut"
            menu={menu}
            active={applied}
            onClick={onCutAdd}
        />
    );
}

export function renderMeasureSelector(props) {
    let { cube, measures, onMeasureChange } = props;

    if (!cube.measures) return null;

    return (
        <div className="pt-form-group">
            <label className="pt-label">Measures</label>
            {cube.measures.map(ms => (
                <Switch
                    checked={measures.indexOf(ms) > -1}
                    key={ms.fullName}
                    onChange={evt => onMeasureChange(ms, evt.target.checked)}
                    label={ms.caption}
                />
            ))}
        </div>
    );
}