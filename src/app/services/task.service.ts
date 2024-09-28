import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private tasks: Task[] = [];

  constructor() {
    this.tasks = this.fetchTasks();
    this.tasksSubject.next(this.tasks);
  }

  // Método privado para simular la obtención de tareas
  private fetchTasks(): Task[] {
    return []
  }

  // Método para guardar una nueva tarea
  saveTask(taskData: Task): Observable<Task[]> {
    const newTask: Task = {
      id: this.generateId(),
      taskName: taskData.taskName,
      date: taskData.date,
      state: taskData.state,
      persons: taskData.persons,
    };

    this.tasks.push(newTask);
    this.tasksSubject.next(this.tasks);
    return this.tasksSubject.asObservable();
  }

  // Método para actualizar el estado de una tarea
  updateTaskState(task: Task, newState: boolean): void {
    const taskToUpdate = this.tasks.find((t) => t.id === task.id);
    if (taskToUpdate) {
      taskToUpdate.state = newState;
      this.tasksSubject.next(this.tasks);
    } else {
      console.error('Tarea no encontrada', task.id);
    }
  }

  private generateId(): number {
    return this.tasks.length ? Math.max(...this.tasks.map((t) => t.id)) + 1 : 1;
  }
}
