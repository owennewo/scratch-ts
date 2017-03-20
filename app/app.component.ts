import {Component, Inject} from "@angular/core";
// import {MenuBarComponent} from "./components/menubar.component";
// import {ContainerComponent} from "./components/container.component";

import {SpecModel} from "./model/spec.model";
import {SpecCategoryModel} from "./model/spec.category.model";
import {Graphics} from "./utils/graphics";


@Component({
  selector: "body",
  template: `
    <nav id="menu-bar" class="navbar navbar-inverse navbar-top"></nav>
    <div id="container" class="container-fluid"></div>
  `
})
export class AppComponent {

    constructor() {
      SpecCategoryModel.initialize();
      SpecModel.initialize();

    }

}
