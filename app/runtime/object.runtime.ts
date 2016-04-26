import {SpriteRuntime} from "./sprite.runtime";
import {StageRuntime} from "./stage.runtime";
import {CostumeModel} from "../model/costume.model";
export abstract class ObjectRuntime {

    visible: boolean;
    volume: number;
    paper: Snap.Paper;
    svg: any;

    constructor(paper: Snap.Paper) {
        this.paper = paper;
    }

    // abstract showCostume(costume: CostumeModel);
    abstract type(): string;
    abstract redraw();

    setVolume(volume: number) {
      this.volume = volume;
    }

    public showCostume(costume: CostumeModel, visible: boolean = true) {
        let backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";

        let defId = "def-" + costume.md5.split("\.")[0];

        let spriteDef = Snap.select("#" + defId);
        if (spriteDef) {
            let useSvg = <Snap.Element> this.paper.use(defId);
            if (!visible) {
                useSvg.addClass("hide");
            }
            this.placeCostume(costume, useSvg);
            this.redraw();
        } else {
            if (costume.md5.endsWith("svg")) {
              Snap.load(backgroundUrl, function(loadedFragment) {
                  let defGroup = this.paper.group();
                  defGroup.attr({
                      id: defId
                  });
                  defGroup.append(loadedFragment);
                  let def = defGroup.toDefs();

                  let useSvg = <Snap.Element> this.paper.use(defId);
                  if (!visible) {
                      useSvg.addClass("hide");
                  }
                  this.placeCostume(costume, useSvg);

                  setTimeout(() => {
                      // zero timeout will allow the svg to be placed and it should have bbox dimensions
                      this.redraw();
                  }, 0);
              }, this);
            } else {
              let image = this.paper.image(backgroundUrl, 0, 0, costume.centerX, costume.centerY);
              let defGroup = this.paper.group();
              defGroup.attr({
                  id: "def-" + costume.md5.split("\.")[0]
              });


              defGroup.append(image);
              let def = defGroup.toDefs();
              let useSvg = <Snap.Element> def.use();
              if (!visible) {
                  useSvg.addClass("hide");
              }
              this.placeCostume(costume, useSvg);
              setTimeout(() => {
                  // zero timeout will allow the svg to be placed and it should have bbox dimensions
                  this.redraw();
              }, 0);
            }

        }
      }

      abstract placeCostume(costume: CostumeModel, obj: Snap.Element);

}
