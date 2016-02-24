import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class LoopShape extends BaseShape {
    substack1H: number = Geometry.EmptySubstackH;
    hasLoopArrow: boolean;

    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
    }

    draw() {
        super.draw();
        let h1: number = this.topH + this.substack1H - Geometry.NotchDepth;

        let builder = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, true, Geometry.SubstackInset)
            .drawArm(h1, this.w)
            .drawRightAndBottom(h1 + Geometry.BottomBarH, this.w, true);
        if (this.hasLoopArrow) {
            builder.drawLoopArrow(this.w, h1 + Geometry.BottomBarH);
        }
        let path = builder.build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
    }

}
