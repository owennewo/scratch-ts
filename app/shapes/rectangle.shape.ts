import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class RectangleShape extends BaseShape {
    constructor(spec: SpecModel, arg: BlockArgModel) {
        super(spec, arg);
    }

    draw(parentGroup: Snap.Element) {
        super.draw(parentGroup);
        this.group.append(Graphics.ScriptPane.drawRect(0, 0, this.w, this.topH, 0, 0, this.spec.category.name.toLowerCase()));
    }

}
