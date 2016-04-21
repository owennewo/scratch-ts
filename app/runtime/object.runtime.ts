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

        let spriteDef = Snap.select("#def-" + costume.md5.split("\.")[0]);
        if (spriteDef) {
            this.placeCostume(costume, <Snap.Element> spriteDef.use());
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

                  this.placeCostume(costume, defGroup.use());

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
              this.placeCostume(costume, defGroup.use());
              setTimeout(() => {
                  // zero timeout will allow the svg to be placed and it should have bbox dimensions
                  this.redraw();
              }, 0);
            }

        }
      }

      abstract placeCostume(costume: CostumeModel, obj: Snap.Element);

}
