import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasklist', pathMatch: 'full' },
  { path: 'taskform', component: TaskFormComponent },
  { path: 'tasklist', component: TaskListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
