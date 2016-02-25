import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {LoopShape} from "./loop.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class IfElseShape extends LoopShape {
    substack2H: number = Geometry.EmptySubstackH;

    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
    }

    draw() {
        super.draw();
        let h1: number = this.topH + this.substack1H - Geometry.NotchDepth;
        let h2: number = h1 + Geometry.DividerH + this.substack2H - Geometry.NotchDepth;

        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.description);

        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, true, Geometry.SubstackInset)
            .drawArm(h1, this.w)
            .drawRightAndBottom(h1 + Geometry.DividerH, this.w, true, Geometry.SubstackInset)
            .drawArm(h2, this.w)
            .drawRightAndBottom(h2 + Geometry.BottomBarH, this.w, true)
            .build();
            this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
            this.group.append(text);
    }
}
