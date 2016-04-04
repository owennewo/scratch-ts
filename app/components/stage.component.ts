import {StageModel} from "../model/stage.model";
import {ModelService} from "../services/model.service";
import {Component, Inject} from "angular2/core";

@Component({
    selector: "section[id=stage]",
    template: `
        <div class="inner">
          <div id="stage-header" class="input-group">
            <span class="input-group-btn">
              <button type="button" class="btn btn-default" (click)="resizeStage()">[+]</button>
            </span>
            <input type="text" class="form-control" id="project-name" aria-label="" value="untitled">
            <div class="input-group-btn" role="group" aria-label="">
              <button type="button" class="btn btn-default" (click)="start()">Start</button>
              <button type="button" class="btn btn-default" (click)="stop()">Stop</button>
            </div>
          </div>
          <svg id="svg-stage" class="svg-stage" viewBox="-240 -160 480 320"></svg>
        </div>

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
      this.stage.runtime.initStage();
    });
  }

    start() {
        this.stop();
        console.log("greenFlag clicked");
        this.stage.runtime.startGreenFlags(true);
    }
    stop() {
        this.stage.runtime.stopAll();
    }

    resizeStage() {
      let runtime = document.querySelector("#stage");
      runtime.classList.toggle("fullscreen");
    }

}
