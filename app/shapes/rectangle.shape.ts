import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class RectangleShape extends BaseShape {
    constructor(spec: SpecModel) {
        super(spec);
    }

    draw() {
        super.draw();
        this.group.append(Graphics.ScriptPane.drawRect(0, 0, this.w, this.topH, this.spec.category.name.toLowerCase()));
    }

}
