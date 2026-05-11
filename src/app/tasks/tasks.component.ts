import { Component, Input} from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { NgFor, NgIf } from "@angular/common";
import { dummyTasks } from '../dummy.tasks';
import { Task } from '../task/task.model';
import { NewTaskComponent } from "./new-task/new-task.component";

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
  
  showAddTaskModal=false;

  tasks=[...dummyTasks];
  
  get selectedTasks(){
    return this.tasks?.filter(task=>task.userId===this.id)
  }
  
  deleteTask(id:string){
    this.tasks=this.tasks?.filter(task=>task.id!==id)
  }
  
  addTask(){
    this.showAddTaskModal=true;    
  }

  onCancelAddTask(){
    this.showAddTaskModal=false;
  }
}
