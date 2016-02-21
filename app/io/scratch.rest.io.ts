import {Http, Response, HTTP_PROVIDERS} from 'angular2/http';
import {Inject, Injectable} from 'angular2/core';
import {ProjectIO} from '../io/project.io';
//import {Scratch} from '../Scratch';
import {Log} from '../logging/Log';
import {ProjectModel} from '../model/project.model';
import {SpriteModel} from '../model/sprite.model';
import {ScriptUI} from '../ui/script.ui';

import {SpecModel} from '../model/spec.model';
import {SpecCategoryModel} from '../model/spec.category.model';
import {Graphics} from '../utils/graphics';



@Injectable()
export class ScratchRestIO {
  id: number;
  name: string;
  lastProjectDir: string;
  
  
  
  constructor(@Inject(Http) private http: Http) {//, @Inject (RunService) private runner: RunService) {
    
  }

  loadProjectJson(res: Response)
  {
    // var json = JSON.parse(res["_body"]);
    // Log.info("Reading project", JSON.stringify(json));
    
    // //var scratch: Scratch = new Scratch();
    // var projectIO: ProjectIO = new ProjectIO();
    // var project = projectIO.readProject(json);
    
    // if (project.children.length > 0)
    // {
    //   var sprite = project.children[0];
    //   if (sprite.scripts && sprite.scripts.length > 0)
    //   {
    //       //ScriptUI.displayScripts(sprite.scripts); 
    //   }
    // }
    
    
    
    ScriptUI.drawCategories();
    
  }
  
  load()
  {
    var projectID = "97867080";
    var projectUrl = "http://projects.scratch.mit.edu/internalapi/project/" + projectID + "/get/";
    console.log ("reading project file:" + projectUrl );
	  this.http.get(projectUrl).subscribe((res:Response) => this.loadProjectJson(res)); 
  }
  

}