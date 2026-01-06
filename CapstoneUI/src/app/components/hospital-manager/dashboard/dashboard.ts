import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import { HospitalSummary } from '../../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-hospital-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class HospitalDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  summary!: HospitalSummary;
  chart: Chart | undefined;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadSummary();
  }

  ngAfterViewInit() {
    // Ensure view is stable before chart rendering
    setTimeout(() => {
      if (this.summary) {
        this.renderChart();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadSummary() {
    this.dashboardService.getHospitalSummary().subscribe({
      next: (res) => {
        this.summary = res;
        this.cdr.detectChanges(); // ✅ Force update
        setTimeout(() => this.renderChart(), 0); // ✅ Render chart in next tick
      },
      error: (err) => console.error('Error loading dashboard summary', err)
    });
  }

  renderChart() {
    const canvas = document.getElementById('claimsByStatusChart') as HTMLCanvasElement;
    if (!canvas || !this.summary) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Submitted (Add Notes)', 'In Review', 'Approved', 'Rejected', 'Paid'],
        datasets: [{
          data: [
            this.summary.submitted,
            this.summary.inReview,
            this.summary.approved,
            this.summary.rejected,
            this.summary.paid
          ],
          backgroundColor: [
            '#FFC107', // Amber
            '#2196F3', // Blue
            '#4CAF50', // Green
            '#F44336', // Red
            '#9C27B0'  // Purple
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              font: { family: "'Inter', sans-serif", size: 12 }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}
