import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  public tasks: Task[] = [];
  private tasksSubscription!: Subscription;
  public filteredTasks: Task[] = [];
  public selectedFilter: string = 'all';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
  }

  goToTaskForm(): void {
    this.router.navigate(['/taskform']);
  }

  filterTasks(filter: string): void {
    if (filter === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.state === true);
    } else if (filter === 'pending') {
      this.filteredTasks = this.tasks.filter((task) => task.state === false);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  toggleTaskState(task: Task): void {
    const newState = !task.state;
    this.taskService.updateTaskState(task, newState);
    this.filterTasks(this.selectedFilter);
  }
}
