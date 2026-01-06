import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Policy } from '../../../../models/policy.model';

@Component({
    standalone: true,
    selector: 'app-agent-policy-details-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './agent-policy-details-dialog.html',
    styleUrls: ['./agent-policy-details-dialog.css']
})
export class AgentPolicyDetailsDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public policy: Policy
    ) { }

    get remainingCoverage(): number {
        return this.policy.coverageAmount - this.policy.claimsUsedAmount;
    }
}
