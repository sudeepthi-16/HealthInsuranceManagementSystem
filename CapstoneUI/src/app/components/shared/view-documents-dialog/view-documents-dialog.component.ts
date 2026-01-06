
import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentService } from '../../../services/document.service';
import { ClaimDocument } from '../../../models/claim-document';

@Component({
  selector: 'app-view-documents-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Claim Documents</h2>
    <mat-dialog-content>
      <div *ngIf="loading()" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading() && documents().length === 0">
        <p>No documents found for this claim.</p>
      </div>

      <mat-list *ngIf="!loading() && documents().length > 0">
        <mat-list-item *ngFor="let doc of documents()">
          <mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>{{ doc.fileName }}</div>
          <div matListItemLine>{{ doc.uploadDate | date:'medium' }} by {{ doc.uploadedBy }}</div>
          <button mat-icon-button matListItemMeta (click)="download(doc)">
            <mat-icon>download</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .loading-container { display: flex; justify-content: center; padding: 20px; }
  `]
})
export class ViewDocumentsDialogComponent implements OnInit {
  documents = signal<ClaimDocument[]>([]);
  loading = signal(true);

  constructor(
    public dialogRef: MatDialogRef<ViewDocumentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claimId: number },
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getDocuments(this.data.claimId).subscribe({
      next: (docs: ClaimDocument[]) => {
        this.documents.set(docs);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading documents', err);
        this.loading.set(false);
      }
    });
  }

  download(doc: ClaimDocument) {
    this.documentService.downloadDocument(doc.id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
