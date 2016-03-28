import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class BooleanShape extends BaseShape {

  indentLeft: number = 15;

    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, group);
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw(x: number, y: number) {
        super.draw(x, y);
        // this.group = parentGroup;
        this.centerY = this.topH / 2;

        let path = PathBuilder.create()
            .moveTo(this.x, this.centerY)
            .lineTo(this.x + this.centerY, 0)
            .lineTo(this.x + this.w - this.centerY, 0)
            .lineTo(this.x + this.w , this.centerY)
            .lineTo(this.x + this.w - this.centerY, this.topH)
            .lineTo(this.x + this.centerY, this.topH)
            .lineTo(this.x, this.centerY)
            .build();
        this.group.prepend(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));

    }


}
