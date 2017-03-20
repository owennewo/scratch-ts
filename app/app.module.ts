import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//import './rxjs-extensions';
import { AppComponent } from './app.component';
import { MenuBarComponent } from "./components/menubar.component";
import { ContainerComponent } from "./components/container.component";
import { BackdropsComponent } from "./components/backdrops.component";
import { StageComponent } from "./components/stage.component";
import { SpritesComponent } from "./components/sprites.component";
import { ModelService } from "./services/model.service";
// import { AppRoutingModule, routedComponents } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
//    AppRoutingModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    MenuBarComponent, 
    ContainerComponent,
    StageComponent, SpritesComponent, BackdropsComponent
  //  routedComponents
  ],
  providers: [
      ModelService,
 //   HeroService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }