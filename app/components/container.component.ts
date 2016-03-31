import {BackdropsComponent} from "./backdrops.component";
import {ScriptLayout} from "../ui/script.layout";
import {SpecLayout} from "../ui/spec.layout";
import {ObjectModel} from "../model/object.model";
import {ModelService} from "./model.service";
import {StageModel} from "../model/stage.model";
import {Component, Inject} from "angular2/core";
import {StageComponent} from "./stage.component"  ;
import {SpritesComponent} from "./sprites.component";

@Component({
  selector: "div[id=container]",
  template: `

  <div class="row">
      <div id="stage-col" class="col-sm-12 col-md-4">
        <div class="container-fluid">
          <div class="row">

            <section id="stage" class="col-sm-6 col-md-12">stage</section>
            <div id="stage-objects" class="col-sm-6 col-md-12">
              <ul class="nav nav-tabs">
                  <li class="active"><a data-toggle="tab" href="#sprites">Sprites</a></li>
                  <li><a data-toggle="tab" href="#backdrops">Backdrops</a></li>
              </ul>

              <div class="tab-content">
                  <section id="sprites" class="tab-pane fade in active" >sprites</section>
                  <section id="backdrops" class="tab-pane fade">background</section>
              </div>
            </div>
          </div>
      </div>
      </div>
      <div id="editor" class="col-sm-12 col-md-8">
          <ul id="editor-tabs" class="nav nav-tabs">
              <li class="active"><a data-toggle="tab" href="#script-editor">Scripts</a></li>
              <li><a data-toggle="tab" href="#background-editor">Backgrounds</a></li>
              <li><a data-toggle="tab" href="#sound-editor">Sounds</a></li>
          </ul>

          <div id="editor-content" class="tab-content">
              <section id="script-editor" class="tab-pane fade in active">

                              <svg id="svg-script-pane"></svg>

              </section>
              <section id="background-editor" class="tab-pane fade">background</section>
              <section id="sound-editor" class="tab-pane fade">sounds</section>
          </div>
          <section id="backpack">backpack</section>
        </div>
   </div>


  `,
  directives: [StageComponent, SpritesComponent, BackdropsComponent]
})
export class ContainerComponent {

  // stage: StageModel;

  constructor(@Inject(ModelService) private modelService: ModelService) {

    modelService.onObjectSelected.subscribe(res => {
      let scratchObject = <ObjectModel> res;
      console.log("loading script for:" + scratchObject.name);
      SpecLayout.drawCategories();

        if (scratchObject.scripts && scratchObject.scripts.length > 0) {
          ScriptLayout.drawScripts(scratchObject.scripts);
        }


    });

    let projectID = "97867080";
    modelService.loadProject(projectID);

  }

  onSelectedObject(event) {
    console.log("+++++++++++++event:" + event);
  }

}
