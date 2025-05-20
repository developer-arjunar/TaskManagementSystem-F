import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TaskService } from '../services/task.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  taskAssigneeForm! : FormGroup;
  
  public taskSummary: any = {};
  public currentUserData: any = {};
  public usersList: Array<any> = [];

  @ViewChild('salesChart', { static: true }) salesChartRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');
    
    Chart.register(...registerables);

    this.getTaskSummary();
    this.loadTaskAssigneeDropDown();

    // this.renderChart();
  }

  // ngAfterViewInit(): void {
  //   this.renderChart();
  // }

  renderChart(): void {
    // console.log(taskSummaryResponse.openedTasks);
    console.log(this.taskSummary.openedTasks);
    
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Opened', 'In Progress', 'Completed', 'Overdue'
        ],
        datasets: [{
          label: 'Tasks',
          data: [this.taskSummary.openedTasks, this.taskSummary.inProgressTasks, this.taskSummary.completedTasks, this.taskSummary.overdueTasks],
          backgroundColor: [
            'rgb(91, 192, 222)',
            'rgb(255, 193, 7)',
            'rgb(25, 135, 84)',
            'rgb(214, 70, 92)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        }
      }
    });
  }

  initiateForm() {
    this.taskAssigneeForm = this.fb.group({
      taskAssignee: ['']
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

  getTaskSummary() {
    this.taskService.getTaskSummary().subscribe(
      (res: any) => {
        this.taskSummary = res;
        this.renderChart();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
