import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  providers: [DatePipe]
})
export class TaskFormComponent implements OnInit {
  taskForm! : FormGroup;

  public usersList: Array<any> = [];
  public isUpdate: boolean = false;
  public taskById: any = {};
  public taskId: any;
  public currentUserData: any = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      
      if(this.taskId) {
        this.isUpdate = true;
        this.getTaskById(this.taskId);
      }
    });

    this.initiateForm();
    this.loadTaskAssigneeDropDown();
  }

  initiateForm() {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      taskAssignee: ['', Validators.required],
      // taskStatus: ['', Validators.required],
      taskStatus: [{value: 'OPENED', disabled: !this.isUpdate}, Validators.required],
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
      if(this.isUpdate == false) {
        let taskData = {
          name: this.taskForm.value.taskName,
          description: this.taskForm.value.taskDescription,
          dueDate: this.taskForm.value.taskDueDate,
          status: this.taskForm.get('taskStatus')?.value,
          assigneeId: this.taskForm.value.taskAssignee,
          createdBy: this.currentUserData.username,
          updatedBy: this.currentUserData.username
        }

        console.log(taskData);
        

        this.taskService.saveNewTask(taskData).subscribe(
          (res: any[]) => {
            Swal.fire({
              title: "Good job!",
              text: "You clicked the button!",
              icon: "success"
            });
  
            this.taskForm.reset();
            this.initiateForm();
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
        this.taskForm.enable();

        let taskData = {
          name: this.taskForm.value.taskName,
          description: this.taskForm.value.taskDescription,
          dueDate: this.taskForm.value.taskDueDate,
          updatedDate: new Date(),
          status: this.taskForm.value.taskStatus,
          assigneeId: this.taskForm.value.taskAssignee,
          updatedBy: this.currentUserData.username
        }

        this.taskService.updateTask(this.taskId, taskData).subscribe(
          (res: any[]) => {
            Swal.fire({
              title: "Good job!",
              text: "You clicked the button!",
              icon: "success"
            });
  
            this.taskForm.reset();
            this.navigateToTaskForm();
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!"
            });
          }
        );
      }

      
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    }
  }

  getTaskById(id: any): void {
    this.taskService.getTaskById(id).subscribe(
      (res: any) => {
        this.taskForm.setValue({
          taskName: res.name,
          taskDescription: res.description,
          taskAssignee: res.assignee.id,
          taskStatus: res.status,
          taskDueDate: this.datePipe.transform(res.dueDate, 'yyyy-MM-dd')
        })

        if (this.currentUserData.role.name === 'USER') {
          this.taskForm.get('taskName')?.disable();
          this.taskForm.get('taskDescription')?.disable();
          this.taskForm.get('taskAssignee')?.disable();
          this.taskForm.get('taskDueDate')?.disable();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  navigateToTasksList() {
    this.router.navigate(['/all-tasks']);
  }

  navigateToTaskForm() {
    this.router.navigate(['/tasks/create-task']);
  }
}
