import { Component,Input} from '@angular/core';
import { Task } from './task.model';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input({required:true}) task!:Task;

  constructor(private taskService:TaskService){}
  
  completeTask(){
    this.taskService.deleteTask(this.task.id)
  }

}
