import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/block.arg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class ProcHatShape extends BaseShape {
    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, group);
        // this.isHat = true;
    }

    draw(x: number, y: number) {
        super.draw(x, y);
        let trimColor = "#8E2EC2"; // 0xcf4ad9;
        let archRoundness: number = Math.min(0.2, 35 / this.w);

// todo
        // .beginFill(trimColor)
        // .lineStyle(1, Specs.ProcedureColor)


        let path = PathBuilder.create()
            .moveTo(0, 15)
            .curve(0, 15, this.w, 15, archRoundness)
            .drawRightAndBottom(this.topH, this.w, true)
            .moveTo(-1, 13)
            .curve(-1, 13, this.w + 1, 13, archRoundness)
            .curve(this.w + 1, 13, this.w, 16, 0.6)
            .curve(this.w, 16, 0, 16, -archRoundness)
            .curve(0, 16, -1, 13, 0.6)
            .build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
    }

}
