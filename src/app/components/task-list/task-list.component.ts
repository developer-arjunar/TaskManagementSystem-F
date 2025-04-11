import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  taskAssigneeForm! : FormGroup;
  commentForm! : FormGroup;

  public tasksList: Array<any> = [];
  public taskById: any = {};
  public taskAssignee: any = {};
  public commentArrayLength: any; 
  public usersList: Array<any> = [];
  public currentUserData: any = {};
  public showCommentTextArea: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.initiateForm();
    this.loadTaskAssigneeDropDown();
    this.loadTasksTable();
  }

  initiateForm() {
    this.taskAssigneeForm = this.fb.group({
      taskAssignee: ['']
    });
  }

  initiateCommentForm() {
    this.commentForm = this.fb.group({
      taskComment: ['', Validators.required]
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

  loadTasksTable(): void {
    if (this.currentUserData.role.name === 'ADMIN') {
      this.taskService.getAllTasks().subscribe(
        (res: any[]) => {
          this.tasksList = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else if(this.currentUserData.role.name === 'USER') {
      this.taskService.getTaskByAssigneeId(this.currentUserData.id).subscribe(
        (res: any[]) => {
          this.tasksList = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    
  }

  loadTasksTableOnChangeAssignee(id: any): void {
    if (id == 'all') {
      this.taskService.getAllTasks().subscribe(
        (res: any[]) => {
          this.tasksList = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.taskService.getTaskByAssigneeId(id).subscribe(
        (res: any[]) => {
          this.tasksList = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  getTaskView(id: any): void {
    this.taskService.getTaskById(id).subscribe(
      (res: any) => {
        console.log(res.comments.length);
        
        this.taskById = res;
        this.taskAssignee = res.assignee;
        this.commentArrayLength = res.comments.length;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteTaskById(id: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe(
          (res: any[]) => {
            
          },
          (error: any) => {
            console.log(error);
          }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });

        this.loadTasksTable();
      }
    });
  }

  postComment(taskId: any) {
    let taskCommentData = {
      taskComment: this.commentForm.value.taskComment,
      createdBy: this.currentUserData.username,
      taskId: taskId
    }

    console.log(taskCommentData);
    

    this.taskService.addNewComment(taskCommentData).subscribe(
              (res: any[]) => {
                this.toggleComponents();
                this.getTaskView(taskId);
              },
              (error) => {
                
              }
            );
  }

  toggleComponents() {
    this.showCommentTextArea = !this.showCommentTextArea;

    if(this.showCommentTextArea == true) {
      this.initiateCommentForm();
    }
  }

  navigateToTaskForm() {
    this.router.navigate(['/tasks/create-task']);
  }

  navigateToEditForm(id: any) {
    this.router.navigate(['/tasks/update-task', id]);
  }
}
