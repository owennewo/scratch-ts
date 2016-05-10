/// <reference path="../definitelytyped/snapsvg.d.ts" />
import {ScriptModel} from "../model/script.model";
import {BlockModel} from "../model/block.model";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {ShapeFactory} from "../shapes/shape.factory";
import {SpecSpacerModel} from "../model/spec.model";
import {SpecOperation} from "../model/spec.model";

export class SpecLayoutService {
    static drawCategories() {
        if (Graphics.ScriptPane.has("#script-pane-categories")) {
          return; // categories already setup
        }
        let groupCategories = Graphics.ScriptPane.group("script-pane-categories", 10, 10);

        let index = 0;

        let rows = Math.ceil(SpecCategoryModel.CATEGORIES.size / 2);

        SpecCategoryModel.CATEGORIES.forEach(category => {

            let row = index % rows;
            let col = Math.floor(index / rows);
            let x = 20 + col * 110;
            let y = 20 + row * 25;

            let groupCategory = Graphics.ScriptPane.group(category.name + "-categories", x, y, category.name.toLowerCase());

            let rectStub = Graphics.ScriptPane.drawRect(0, 0, 10, 20, 0, 0, "stub");
            let rectMain = Graphics.ScriptPane.drawRect(10, 0, 90, 20, 0, 0, "main");

            groupCategory.click((event: MouseEvent) => {
              let categorySvgs: Snap.Element[] = Snap.selectAll("#script-pane-categories g");
              categorySvgs.forEach (categorySvg => { categorySvg.removeClass("active"); });
              this.drawCategory(category);
            });

            groupCategory.append(rectStub);
            groupCategory.append(rectMain);
            groupCategory.append(Graphics.ScriptPane.drawText(15, 15, category.name, "#FFF"));
            category.svg = groupCategory;
            groupCategories.append(groupCategory);

            index++;

        });


        this.drawCategory(SpecCategoryModel.CATEGORIES.get(1));
    }

    static drawCategory(category: SpecCategoryModel) {
        category.svg.addClass("active");

        let oldCategoryBlocks = Graphics.ScriptPane.paper.select("#script-pane-categories-blocks");
        if (oldCategoryBlocks) {
          oldCategoryBlocks.remove();
        }

        let newCategoryBlocks = Graphics.ScriptPane.group("script-pane-categories-blocks", 10, 200, "spec-categories");

        let xPos = 0;
        let yPos = 0;
        category.specs.forEach(spec => {
          if (spec instanceof SpecSpacerModel) {
            yPos += 10;
            return;
          }
            let shape = ShapeFactory.createShape(spec);
            shape.newGroup(newCategoryBlocks, xPos, yPos, spec);
            shape.setDraggable(true);
            shape.drawHeader(spec.labelsAndArgs);
            shape.draw(0, 0);
            let shapeHeight = shape.getGroup().getBBox().h;
            yPos += shapeHeight + 5;
        });
    }


    static displayScripts(scripts: ScriptModel[]) {
        for (let script of scripts) {
            console.log(" + script is at:" + script.x + ":" + script.y);
            this.displayBlock(script.firstBlock);
        }
    }

    static displayBlock(block: BlockModel) {
        console.log("    - block" + block.spec.code + "[" + block.args + "]");
        if (block.nextBlock) {
            this.displayBlock(block.nextBlock);
        }
    }
}
