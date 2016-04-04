import {ModelService} from "./services/model.service";
import {bootstrap}    from "angular2/platform/browser";
import {AppComponent} from "./app.component";
import {HTTP_PROVIDERS} from "angular2/http";
import {RestIOService} from "./services/rest.io.service";

bootstrap(AppComponent, [HTTP_PROVIDERS, RestIOService, ModelService]);
