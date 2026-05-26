import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';
import { BrowserModule } from '@angular/platform-browser';
import { CardComponent } from './shared/card/card.component';
import { TaskComponent } from './tasks/task/task.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, HeaderComponent, UserComponent, 
    TasksComponent,
    CardComponent,
    TaskComponent,
    NewTaskComponent,
], // here we declare all the module-based components that we are going to use
  bootstrap: [AppComponent], // first component that will be bootstraped
  imports: [
    BrowserModule,
    RouterOutlet,
    FormsModule
  ], // NgModules (and standalone components/directives/pipes) to make available in this module
})
export class AppModule {}
