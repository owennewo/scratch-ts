import {StageModel} from "../model/stage.model";
import {ModelService} from "./model.service";
import {Component, Inject} from "angular2/core";

@Component({
    selector: "section[id=stage]",
    template: `

        <div id="stage-header">stage header<a class="button" (click)="start()">Start</a><a class="button" (click)="stop()">Stop</a></div>
        <div id="stage-content">stage content</div>

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
    });
  }

    start() {
        console.log("start");
        this.stage.runtime.startGreenFlags(true);
    }
    stop() {
        console.log("stop");
    }
}
