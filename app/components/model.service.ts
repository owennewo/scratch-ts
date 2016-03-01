import {ScriptLayout} from "../ui/script.layout";
import {SpecLayout} from "../ui/spec.layout";
import {ProjectIO} from "../io/project.io";
import {ProjectModel} from "../model/project.model";
import {ObjectModel} from "../model/object.model";
import {Injectable, Inject} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {EventEmitter} from "angular2/core";

@Injectable()
export class ModelService {
  items: Array<any>;

  onProjectLoaded = new EventEmitter<ProjectModel>();
  onObjectSelected = new EventEmitter<ObjectModel>();

  constructor(@Inject(Http) private http: Http) {
    
  }

  selectObject(scratchObject: ObjectModel) {
    this.onObjectSelected.emit(scratchObject);
  }

  loadProject(projectId: string) {

    let projectUrl = "http://projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/";
    console.log("reading project file:" + projectUrl);
    this.http.get(projectUrl).subscribe((res: Response) => {
      let json = JSON.parse(res["_body"]);
      console.log("Reading project", JSON.stringify(json));

      // var scratch: Scratch = new Scratch();
      let projectIO: ProjectIO = new ProjectIO();
      let project = projectIO.readProject(json);

      this.onProjectLoaded.emit(project);

      // SpecLayout.drawCategories();
      //
      // if (project.children.length > 0) {
      //   let sprite = project.children[0];
      //   if (sprite.scripts && sprite.scripts.length > 0) {
      //     ScriptLayout.drawScripts(sprite.scripts);
      //   }
      // }

    });
  }

}
