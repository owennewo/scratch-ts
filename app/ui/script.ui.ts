import {ScriptModel} from "../model/script.model";
import {BlockModel} from "../model/block.model";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {ShapeFactory} from "../shapes/shape.factory";

export class ScriptUI {
    static drawCategories() {
        let group = Graphics.newGroup("categories_group", 10, 10);

        let index = 0;

        let rows = Math.ceil(SpecCategoryModel.CATEGORIES.size / 2);

        SpecCategoryModel.CATEGORIES.forEach(category => {
            console.log(" + " + category.name);
            let row = index % rows;
            let col = Math.floor(index / rows);
            let x = 20 + col * 100;
            let y = 20 + row * 25;
            group.color = category.color;
            group.drawRect(x, y, 90, 20);
            group.color = "#FFF";
            group.drawText(x + 5, y + 15, category.name, category.color);

            index++;

        });

        this.drawCategory(SpecCategoryModel.CATEGORIES.get(2));
    }

    static drawCategory(category: SpecCategoryModel) {
        console.log("drawing " + category.name);

        let index = 0;
        category.specs.forEach(spec => {

            let shape = ShapeFactory.createShape(category, spec, 20, 200 + 30 * index);

            shape.draw();
            index++;
        });
    }


    static displayScripts(scripts: ScriptModel[]) {
        for (let script of scripts) {
            console.log(" + script is at:" + script.x + ":" + script.y);
            this.displayBlock(script.firstBlock);
        }
    }

    static displayBlock(block: BlockModel) {
        console.log("    - block" + block.op + "[" + block.args + "]");
        if (block.nextBlock) {
            this.displayBlock(block.nextBlock);
        }
    }
}
