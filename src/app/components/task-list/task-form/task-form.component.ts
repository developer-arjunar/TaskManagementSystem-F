import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initiateForm();
    this.loadTaskAssigneeDropDown();

    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      
      if(this.taskId) {
        this.isUpdate = true;
        this.getTaskById(this.taskId);
      }
    });
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
      if(this.isUpdate == false) {
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
        let taskData = {
          name: this.taskForm.value.taskName,
          description: this.taskForm.value.taskDescription,
          dueDate: this.taskForm.value.taskDueDate,
          updatedDate: new Date(),
          status: "OPENED",
          assigneeId: this.taskForm.value.taskAssignee
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
          taskDueDate: this.datePipe.transform(res.dueDate, 'yyyy-MM-dd')
        })
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
