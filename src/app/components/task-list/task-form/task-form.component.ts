import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  taskForm! : FormGroup;

  public usersList: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initiateForm();
    this.loadTaskAssigneeDropDown();
  }

  initiateForm() {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      taskAssignee: ['', Validators.required],
      taskDueDate: ['', Validators.required]
    });
  }

  loadTaskAssigneeDropDown(): void {
    this.userService.getAllUsers().subscribe(
      (res: any[]) => {
      this.usersList = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  onSubmit() {
    if(this.taskForm.valid) {
      let taskData = {
        name: this.taskForm.value.taskName,
        description: this.taskForm.value.taskDescription,
        dueDate: this.taskForm.value.taskDueDate,
        assigneeId: this.taskForm.value.taskAssignee
      }

      this.taskService.saveNewTask(taskData).subscribe(
        (res: any[]) => {
          Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success"
          });

          this.taskForm.reset();
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
