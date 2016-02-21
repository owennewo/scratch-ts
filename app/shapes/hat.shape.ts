import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class HatShape extends BaseShape {

    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
        //this.isHat = true;
        this.indentTop = 12;
    }

    draw() {
        super.draw();
        this.g
            .moveTo(0, 12)
            .curve(0, 12, 40, 0, 0.15)
            .curve(40, 0, 80, 10, 0.12)
            .lineTo(this.w - Geometry.CornerInset, 10)
            .lineTo(this.w, 10 + Geometry.CornerInset)
            .drawRightAndBottom(this.topH, this.w, true)
            .fill(this.color);
    }

}