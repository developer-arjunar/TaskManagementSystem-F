import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('salesChart', { static: true }) salesChartRef!: ElementRef;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.renderChart();
  }

  renderChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Sales',
            data: [12000, 19000, 15000, 18000, 22000, 25000, 21000, 23000, 28000, 30000, 32000, 35000],
            backgroundColor: 'rgba(60, 141, 188, 0.2)',
            borderColor: 'rgba(60, 141, 188, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Revenue',
            data: [8000, 12000, 10000, 15000, 18000, 20000, 17000, 19000, 22000, 25000, 28000, 30000],
            backgroundColor: 'rgba(0, 166, 90, 0.2)',
            borderColor: 'rgba(0, 166, 90, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
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
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
}
