import {BackdropsComponent} from "./backdrops.component";
import {ScriptLayout} from "../ui/script.layout";
import {SpecLayout} from "../ui/spec.layout";
import {ObjectModel} from "../model/object.model";
import {ModelService} from "./model.service";
import {ProjectModel} from "../model/project.model";
import {Component, Inject} from "angular2/core";
import {StageComponent} from "./stage.component"  ;
import {SpritesComponent} from "./sprites.component";

@Component({
  selector: "div[id=container]",
  template: `


    <div class="row">

        <div class="fixed-width-499">
            <section id="stage">stage</section>
            <ul class="nav nav-tabs">
                <li class="active"><a data-toggle="tab" href="#sprites">Sprites</a></li>
                <li><a data-toggle="tab" href="#backdrops">Backdrops</a></li>
            </ul>

            <div class="tab-content">
                <section id="sprites" class="tab-pane fade in active" >sprites</section>
                <section id="backdrops" class="tab-pane fade">background</section>
            </div>
        </div>

        <div class="col-md-12 col-offset-500">
            <!--div class="row">
                <div class="col-md-4"-->
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
                <!--/div-->
        </div>

   </div>

  `,
  styles: [`

  #stage, #sprites-and-backdrops { height: 420px; padding:10px; }
  //#left-column, #right-column { display: table; padding-left: 0px;}
  //#editor-tabs, #editor-content, #backpack { display: table-row; }
  #editor-content { height: 100%; }
  #script-category { background: #ccc};
  #script-pane { background: #aaa};
  #script-editor { height:100% }
svg { width:100%; height:100%; background: #ffe}

.col-offset-250 { padding-left:250px; background: #ddd; height: 100%; width:100%; position: fixed;}
.col-offset-500 { padding-left:500px; background: #ddd; height: 100%; width:100%; position: fixed;}
.fixed-width-499 { width:500px; background: #ddd; height: 100%; position: fixed; z-index:100}
  `],
  directives: [StageComponent, SpritesComponent, BackdropsComponent]
})
export class ContainerComponent {

  project: ProjectModel;

  constructor(@Inject(ModelService) private modelService: ModelService) {
    modelService.onProjectLoaded.subscribe(res => {
      console.log("_+_+_+:" + res);
    });

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
