import {SpriteModel} from "../model/sprite.model";
import {ModelService} from "./model.service";
import {ObjectModel} from "../model/object.model";
import {StageModel} from "../model/stage.model";
import {Inject, Component, Input, Output, EventEmitter} from "angular2/core";

@Component({
  selector: "section[id=sprites]",
  template: `

        <h1>Sprites are us</h1>
        <ul class="sprites">
          <li *ngFor="#sprite of sprites"
            [class.selected]="sprite === selectedObject"
            (click)="onSelect(sprite)">
            <span class="badge">{{sprite.id}}</span> {{sprite.name}}
          </li>
        </ul>

  `,
  styles: [`

  `]
})
export class SpritesComponent {

  sprites: SpriteModel[];
  selectedObject: ObjectModel;

  constructor(@Inject(ModelService) private modelService: ModelService) {
    modelService.onProjectLoaded.subscribe(data => {
      let project = <StageModel> data;
      this.sprites = project.children;

      modelService.selectObject(project.children[0]);
    });
  }

  onSelect(sprite: SpriteModel) {
    console.log("selected sprite:" + sprite.name);
    if (this.selectedObject !== sprite) {
      this.selectedObject = sprite;
      this.modelService.selectObject(this.selectedObject);
    }
  }
}
