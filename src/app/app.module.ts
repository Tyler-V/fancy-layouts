import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedService } from './services/shared-service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ContentComponent } from './components/content/content.component';
import { ContainerComponent } from './components/container/container.component';
import { ResizeDirective } from './directives/resize.directive';
import { MoveDirective } from './directives/move.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    ContentComponent,
    ContainerComponent,
    ResizeDirective,
    MoveDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }