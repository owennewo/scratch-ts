import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class StackShape extends BaseShape {
    stack1h: number = Geometry.EmptyStackH;
    stack1y: number = 24;
    hasLoopArrow: boolean = true;
    isFinal: boolean;

    constructor(spec: SpecModel, args: any[], isFinal: boolean = false) {
        super(spec, args);
        this.isFinal = isFinal;
        // let loopBlocks: string[] = ["doForever", "doForeverIf", "doRepeat", "doUntil"];


        // this.base.hasLoopArrow = (loopBlocks.indexOf(this.op) >= 0);
    }

    draw(parentGroup: Snap.Element, prepend: boolean = false) {
        super.draw(parentGroup);

        let h1: number = this.topH + this.stack1h - Geometry.NotchDepth;

        let builder = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, true, Geometry.StackInset)
            .drawArm(h1, this.w)
            .drawRightAndBottom(h1 + Geometry.BottomBarH, this.w, true);
        if (this.hasLoopArrow) {
            builder.drawLoopArrow(this.w, h1 + Geometry.BottomBarH);
        }
        let pathString = builder.build();
        let path = Graphics.ScriptPane.drawPath(pathString, this.spec.category.name.toLowerCase());
        if (prepend) {
            this.group.prepend(path);
        } else {
            this.group.append(path);
        }
    }

}
