import {ScriptLayoutService} from "../services/script.layout.service";
import {SpecLayoutService} from "../services/spec.layout.service";
import {ProjectIOService} from "../services/project.io.service";
import {StageModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {Injectable, Inject} from "angular2/core";
import {Http, Response} from "angular2/http";
import {EventEmitter} from "angular2/core";

@Injectable()
export class ModelService {
  items: Array<any>;

  onProjectLoaded = new EventEmitter<StageModel>();
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
      // console.log("Reading project", JSON.stringify(json));

      // var scratch: Scratch = new Scratch();
      let projectIO: ProjectIOService = new ProjectIOService();
      let project = projectIO.readProject(json);

      this.onProjectLoaded.emit(project);

    });
  }

}
