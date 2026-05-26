import { Component, Input} from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NgFor, NgIf } from "@angular/common";
import { NewTask } from './task/task.model';
import { NewTaskComponent } from "./new-task/new-task.component";
import { TaskService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NgFor, NgIf, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent{
  @Input({required:true}) id!:string;
  @Input({required:true}) name!:string;

  constructor(private tasksService:TaskService){}
  
  showAddTaskModal=false;
  
  get selectedTasks(){
    return this.tasksService.getUserTasks(this.id);
  }
  
  showAddTask(){
    this.showAddTaskModal=true;    
  }

  onClose(){
    this.showAddTaskModal=false;
  }

  addTask(obj:NewTask){   
    this.tasksService.addTask(obj,this.id);
    this.showAddTaskModal=false;
  }
}
