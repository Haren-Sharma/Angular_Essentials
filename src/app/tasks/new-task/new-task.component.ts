import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewTask } from '../task/task.model';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  @Input({required:true}) userId!:string;
  @Output() close=new EventEmitter<void>();

  constructor(private taskService:TaskService){}

  enteredTitle=''
  enteredSummary=''
  enteredDate=''

  onCancel(){
    this.close.emit()
  }

  onSubmit(){
    this.taskService.addTask({
      title:this.enteredTitle,
      summary:this.enteredSummary,
      dueDate:this.enteredDate
    },this.userId);
    this.onCancel();
  }
}
