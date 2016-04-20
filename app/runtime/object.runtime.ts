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

    public showCostume(costume: CostumeModel) {
        let backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";
        if (!this.svg) {
            this.svg = this.paper.group();
            this.svg.attr({
                id: this.type() + "-" + costume.name
            });
        } else {
          if (this instanceof SpriteRuntime) {
            this.svg.clear();
          }
        }

        let spriteDef = Snap.select("#def-" + costume.md5.split("\.")[0]);
        if (spriteDef) {
            this.svg.append(spriteDef.use());
            this.redraw();
        } else {
            if (costume.md5.endsWith("svg")) {
              Snap.load(backgroundUrl, function(loadedFragment) {
                  let defGroup = this.paper.group();
                  defGroup.attr({
                      id: "def-" + costume.md5.split("\.")[0]
                  });
                  defGroup.append(loadedFragment);
                  defGroup.toDefs();
                  if (this instanceof StageRuntime) {
                      defGroup.transform("translate(-240, -180)");
                      this.svg.prepend(defGroup.use());
                  } else {
                      this.svg.append(defGroup.use());
                  }


                  setTimeout(() => {
                      // zero timeout will allow the svg to be placed and it should have bbox dimensions
                      this.redraw();
                  }, 0);
              }, this);
            } else {
              let image = this.paper.image(backgroundUrl, -240, -160, 480, 360);
              let defGroup = this.paper.group();
              defGroup.attr({
                  id: "def-" + costume.md5.split("\.")[0]
              });
              defGroup.append(image);
              defGroup.toDefs();
              this.svg.append(defGroup.use());
              setTimeout(() => {
                  // zero timeout will allow the svg to be placed and it should have bbox dimensions
                  this.redraw();
              }, 0);
            }

        }
      }

}
