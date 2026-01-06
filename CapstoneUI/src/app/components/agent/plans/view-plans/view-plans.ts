
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PlanService } from '../../../../services/plan.service';
import { InsurancePlanAdminResponse } from '../../../../models/plan.model';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule
    ],
    templateUrl: './view-plans.html',
    styleUrls: ['./view-plans.css']
})
export class ViewPlansComponent implements OnInit {

    plans = signal<InsurancePlanAdminResponse[]>([]);
    loading = signal(true);

    constructor(private planService: PlanService) { }

    ngOnInit() {
        this.loadActivePlans();
    }

    loadActivePlans() {
        this.loading.set(true);
        this.planService.getPlans().subscribe({
            next: (res) => {
                this.plans.set(res);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load plans', err);
                this.loading.set(false);
            }
        });
    }
}
