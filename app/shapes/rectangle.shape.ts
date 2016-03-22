import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class RectangleShape extends BaseShape {
    constructor(spec: SpecModel, args: any[]) {
        super(spec, args);
    }

    draw(parentGroup: Snap.Element) {
        this.group = parentGroup;
        this.group.append(Graphics.ScriptPane.drawRect(this.x, 0, this.w, this.topH, 0, 0, this.spec.category.name.toLowerCase()));
    }

}
