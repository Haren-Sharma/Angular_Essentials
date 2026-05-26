import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { TasksModule } from './tasks/tasks.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
  ], // here we declare all the module-based components that we are going to use
  bootstrap: [AppComponent], // first component that will be bootstraped
  imports: [BrowserModule,SharedModule,RouterOutlet,TasksModule], // NgModules (and standalone components/directives/pipes) to make available in this module
})
export class AppModule {}
