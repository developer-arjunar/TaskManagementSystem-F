import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  public tasksList: Array<any> = [];

  constructor(
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (res: any[]) => {
        console.log(res);
        

        this.tasksList = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
