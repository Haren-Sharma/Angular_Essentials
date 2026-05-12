import { Injectable } from '@angular/core';
import { dummyTasks } from '../dummy.tasks';
import { NewTask } from './task/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = [...dummyTasks];

  getUserTasks(userId: string) {
    return this.tasks?.filter((task) => task.userId === userId);
  }

  deleteTask(id: string) {
    this.tasks = this.tasks?.filter((task) => task.id !== id);
  }

  addTask(taskObj: NewTask, id: string) {
    this.tasks.unshift({
      id: 't' + (this.tasks.length + 1),
      userId: id,
      title: taskObj.title,
      summary: taskObj.summary,
      dueDate: taskObj.dueDate,
    });
  }
}
