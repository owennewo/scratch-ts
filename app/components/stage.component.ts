import {StageModel} from "../model/stage.model";
import {ModelService} from "./model.service";
import {Component, Inject} from "angular2/core";

@Component({
    selector: "section[id=stage]",
    template: `

        <div id="stage-header" class="input-group">
          <span class="input-group-btn">
            <button type="button" class="btn btn-default" (click)="resize()">[+]</button>
          </span>
          <input type="text" class="form-control" id="project-name" aria-label="" value="untitled">
          <div class="input-group-btn" role="group" aria-label="">
            <button type="button" class="btn btn-default" (click)="start()">Start</button>
            <button type="button" class="btn btn-default" (click)="stop()">Stop</button>
          </div>
        </div>
        <div id="stage-content"><svg id="svg-stage" viewBox=\"-240 -180 480 360\"></svg></div>

  `,
    styles: [`
    #stage-header
    {
      height: 40px;
    }
    #stage-content
    {
      width: 480px;
      height: 360px;
      background: lightblue;
    }
  `]
})
export class StageComponent {
  stage: StageModel;

  constructor(@Inject(ModelService) private modelService: ModelService) {
    modelService.onProjectLoaded.subscribe(data => {
      this.stage = <StageModel> data;
      console.log("StageComponent is starting threads");
      this.stage.runtime.start();
    });
  }

    start() {
        console.log("greenFlag clicked");
        this.stage.runtime.startGreenFlags(true);
    }
    stop() {
        console.log("todo: stop");
    }

    resizeStage() {
        console.log("todo resizeStage");
    }

}
