import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  private taskForm: FormGroup = new FormGroup({});
  private refPersons!: FormArray;
  public isTaskSaved: boolean = false;
  public hasErrors: boolean = false;

  constructor(private router: Router, private taskService: TaskService) {}

  public getTaskForm(): FormGroup {
    return this.taskForm;
  }

  public getPersonForm(): FormArray {
    return this.refPersons;
  }

  ngOnInit(): void {
    this.initTaskForm();
  }

  initTaskForm(): void {
    this.taskForm = new FormGroup({
      taskName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      date: new FormControl('', [Validators.required]),
      state: new FormControl(false, []),
      persons: new FormArray([], [Validators.required]),
    });
    this.addPersons();
  }

  initPersonForm(): FormGroup {
    return new FormGroup({
      personName: new FormControl('', [
        Validators.required,
        this.validatePersonName.bind(this),
      ]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(19),
        this.validateAge,
      ]),
      skills: new FormArray(
        [],
        [Validators.required, this.validateSkillsArray]
      ),
    });
  }

  validateSkillsArray(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const skills = control.value as FormGroup[];
    if (!skills || skills.length === 0) {
      return { emptySkills: true };
    } else {
      return null;
    }
  }

  validatePersonName(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const personName = control.value;
    const personsArray = this.taskForm.get('persons') as FormArray;

    // Verificar si el nombre ya está en uso en otra persona de la misma tarea
    const isDuplicate = personsArray.controls.some((person) => {
      return (
        person !== control.parent &&
        person.get('personName')?.value === personName
      );
    });

    if (isDuplicate) {
      return { duplicatePersonName: true };
    } else {
      return null;
    }
  }

  validateAge(control: AbstractControl): { [key: string]: boolean } | null {
    const age = control.value;
    if (age < 0) {
      return { invalidAge: true };
    } else {
      return null;
    }
  }

  initFormSkill(): FormGroup {
    return new FormGroup({
      skillName: new FormControl('', [Validators.required]),
    });
  }

  addPersons(): void {
    const refPersons = this.taskForm.get('persons') as FormArray;
    const newPerson = this.initPersonForm();
    refPersons.push(newPerson);
    this.addSkills(refPersons.length - 1);
  }

  addSkills(index: number): void {
    const refPersons = this.taskForm.get('persons') as FormArray;
    const refPerson = refPersons.at(index) as FormGroup;
    const refSkills = refPerson.get('skills') as FormArray;
    refSkills.push(this.initFormSkill());
  }

  removeSkill(indexPerson: number, indexSkill: number): void {
    const refPersons = this.taskForm.get('persons') as FormArray;
    const refPerson = refPersons.at(indexPerson) as FormGroup;
    const refSkills = refPerson.get('skills') as FormArray;

    if (refSkills.length > 1) {
      refSkills.removeAt(indexSkill);
    }
  }

  removePerson(indexPerson: number): void {
    const refPersons = this.taskForm.get('persons') as FormArray;
    if (refPersons.length > 1) {
      refPersons.removeAt(indexPerson);
    }
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      console.log('Task saved:', taskData);

      this.taskService.saveTask(taskData);

      this.isTaskSaved = true;
      this.hasErrors = false;

      setTimeout(() => {
        this.isTaskSaved = false;
        this.router.navigate(['/tasklist']);
      }, 1000);
    } else {
      this.taskForm.markAllAsTouched();
      this.hasErrors = true;
      this.isTaskSaved = false;
    }
  }
}
