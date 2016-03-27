import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class BooleanShape extends BaseShape {
    constructor(spec: SpecModel, args: any[]) {
        super(spec, args);
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw(parentGroup: Snap.Element) {
        this.group = parentGroup;
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
        this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));

    }


}
