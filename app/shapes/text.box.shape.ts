import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class TextBoxShape extends BaseShape {
    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, group);
    }

    draw(x: number, y: number) {
        let value = (<BlockArgModel> this.arg).argValue;
        if (!value) value = (<BlockArgModel> this.arg).defaultArgValue;

        let text = Graphics.ScriptPane.drawText(x, y, value);
        let textBox = text.getBBox();
        text.attr({
            y: textBox.h
        });

        this.group.append(Graphics.ScriptPane.drawRect(x, y, textBox.w, textBox.h, 0, 0, this.spec.category.name.toLowerCase()));
        this.group.append(text);
    }

}
