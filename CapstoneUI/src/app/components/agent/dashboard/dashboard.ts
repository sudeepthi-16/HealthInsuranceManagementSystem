import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AgentDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {

  summary!: any;
  highValueClaims: any[] = [];
  displayedColumns: string[] = ['policyId', 'customerName', 'utilization', 'totalAmountUsed', 'coverageAmount'];

  private charts: Chart[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  
  ngOnInit() {
    this.loadSummary();
  }

  
  ngAfterViewInit() {
    // Delay to ensure layout is fully settled
    setTimeout(() => {
      this.loadClaimsByOfficer();
      this.loadPoliciesByStatus();
      this.loadClaimsByStatus();
      this.loadClaimsByHospital();
      this.loadHighValueClaims();

      // Force chart resize after creation
      setTimeout(() => {
        this.charts.forEach(chart => {
          chart.resize();
          chart.update();
        });
      }, 200);
    }, 500);
  }

  /* Cleanup (important for reload/navigation) */
  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  loadSummary() {
    this.dashboardService
      .getSummary()
      .subscribe(res => {
        this.summary = res;
        console.log('Summary loaded:', this.summary);
        this.cdr.detectChanges();
      });
  }

  loadClaimsByOfficer() {
    this.dashboardService.getClaimsByOfficer().subscribe(data => {
      const canvas = document.getElementById(
        'claimsByOfficer'
      ) as HTMLCanvasElement;

      if (!canvas) return;

      const chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: data.map(x => x.officerName),
          datasets: [
            { label: 'Approved', data: data.map(x => x.approved) },
            { label: 'Rejected', data: data.map(x => x.rejected) }
          ]
        }
      });

      this.charts.push(chart);
    });
  }

  loadPoliciesByStatus() {
    this.dashboardService.getPoliciesByStatus().subscribe(data => {
      const canvas = document.getElementById(
        'policiesByStatus'
      ) as HTMLCanvasElement;

      if (!canvas) return;

      const chart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: data.map(x => x.status),
          datasets: [{ data: data.map(x => x.count) }]
        }
      });

      this.charts.push(chart);
    });
  }

  loadClaimsByStatus() {
    this.dashboardService.getClaimsByStatus().subscribe(data => {
      const canvas = document.getElementById(
        'claimsByStatus'
      ) as HTMLCanvasElement;

      if (!canvas) return;

      const chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: data.map(x => x.status),
          datasets: [{ data: data.map(x => x.count) }]
        }
      });

      this.charts.push(chart);
    });
  }

  loadClaimsByHospital() {
    this.dashboardService.getClaimsByHospital().subscribe(data => {
      const canvas = document.getElementById(
        'claimsByHospital'
      ) as HTMLCanvasElement;

      if (!canvas) return;

      const chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: data.map(x => x.hospitalName),
          datasets: [
            { label: 'Claims', data: data.map(x => x.claimCount) }
          ]
        }
      });

      this.charts.push(chart);
    });
  }
  loadHighValueClaims() {
    this.dashboardService.getHighValueClaims().subscribe(data => {
      this.highValueClaims = data;
      this.cdr.detectChanges();
    });
  }
}
