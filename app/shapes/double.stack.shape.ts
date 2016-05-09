import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/block.arg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {StackShape} from "./stack.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class DoubleStackShape extends StackShape {
    stack2h: number = Geometry.EmptyStackH;
    stack2y: number;

    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, false, group);
    }

    draw(x: number, y: number) {
        super.draw(x, y);
        let h1: number = this.topH + this.stack1h - Geometry.NotchDepth;
        let h2: number = h1 + Geometry.DividerH + this.stack2h - Geometry.NotchDepth;

        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.label);

        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, true, Geometry.StackInset)
            .drawArm(h1, this.w)
            .drawRightAndBottom(h1 + Geometry.DividerH, this.w, true, Geometry.StackInset)
            .drawArm(h2, this.w)
            .drawRightAndBottom(h2 + Geometry.BottomBarH, this.w, true)
            .build();
            this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
            this.group.append(text);
    }
}
