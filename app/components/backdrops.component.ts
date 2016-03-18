import {CostumeModel} from "../model/costume.model";
import {SpriteModel} from "../model/sprite.model";
import {ModelService} from "./model.service";
import {ObjectModel} from "../model/object.model";
import {StageModel} from "../model/stage.model";
import {Inject, Component, Input, Output, EventEmitter} from "angular2/core";

@Component({
  selector: "section[id=backdrops]",
  template: `

        <h1>Sprites are us</h1>
        <ul class="backdrops">
          <li *ngFor="#background of backgrounds"
            [class.selected]="background === selectedObject"
            (click)="onSelect(background)">
            <span class="badge">{{background.id}}</span> {{background.name}}
          </li>
        </ul>

  `,
  styles: [`

  `]
})
export class BackdropsComponent {
  project: ObjectModel;
  backgrounds: CostumeModel[];
  selectedObject: ObjectModel;


  constructor(@Inject(ModelService) private modelService: ModelService) {
    modelService.onProjectLoaded.subscribe(data => {
      let project = <StageModel> data;
      this.project = project;
      this.backgrounds = project.costumes;
      // project.costumes.forEach(sprite => {
      //     console.log("background: " + sprite.name);
      // });
      // modelService.selectObject(project.children[0]);
    });

    modelService.onObjectSelected.subscribe(data => {
      this.selectedObject = <ObjectModel> data;
    });
  }

  onSelect(background: CostumeModel) {
    console.log("selected sprite:" + background.name);
    if (!this.selectedObject || this.selectedObject !== this.project) {
      this.selectedObject = this.project;
      this.modelService.selectObject(this.project);
    }

  }

}
