import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';

export class HatShape extends BaseShape {

    constructor(color: number) {
        super(color);
        //this.isHat = true;
        this.indentTop = 12;
    }

    draw() {

        Graphics.builder()
            .moveTo(0, 12)
            .curve(0, 12, 40, 0, 0.15)
            .curve(40, 0, 80, 10, 0.12)
            .lineTo(this.w - Geometry.CornerInset, 10)
            .lineTo(this.w, 10 + Geometry.CornerInset)
            .drawRightAndBottom(this.topH, this.w, true)
            .draw();
    }

}