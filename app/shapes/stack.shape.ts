import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class StackShape extends BaseShape {
    stack1h: number = Geometry.EmptyStackH;
    stack1y: number;
    hasLoopArrow: boolean = true;
    isFinal: boolean;

    constructor(spec: SpecModel, args: any[], isFinal: boolean = false) {
        super(spec, args);
        this.isFinal = isFinal;
        // let loopBlocks: string[] = ["doForever", "doForeverIf", "doRepeat", "doUntil"];


        // this.base.hasLoopArrow = (loopBlocks.indexOf(this.op) >= 0);
    }

    draw(parentGroup: Snap.Element) {
        super.draw(parentGroup);
        let h1: number = this.topH + this.stack1h - Geometry.NotchDepth;

        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.label, this.args);

        this.w = text.getBBox().width + 20;

        let builder = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, true, Geometry.StackInset)
            .drawArm(h1, this.w)
            .drawRightAndBottom(h1 + Geometry.BottomBarH, this.w, true);
        if (this.hasLoopArrow) {
            builder.drawLoopArrow(this.w, h1 + Geometry.BottomBarH);
        }
        let path = builder.build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
        this.group.append(text);

    }

}
