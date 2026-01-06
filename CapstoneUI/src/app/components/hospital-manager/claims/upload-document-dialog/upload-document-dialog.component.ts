
import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentService } from '../../../../services/document.service';

@Component({
  selector: 'app-upload-document-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <h2 mat-dialog-title>Upload Document</h2>
    <mat-dialog-content>
      <div class="file-upload-container">
        <input type="file" (change)="onFileSelected($event)" #fileInput style="display: none">
        <button mat-stroked-button color="primary" (click)="fileInput.click()">
          <mat-icon>attach_file</mat-icon> Choose File
        </button>
        <span *ngIf="selectedFile" class="file-name">{{ selectedFile.name }}</span>
      </div>

      <mat-progress-bar *ngIf="isUploading()" mode="indeterminate"></mat-progress-bar>
      <p *ngIf="errorMessage()" class="error">{{ errorMessage() }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!selectedFile || isUploading()" (click)="upload()">
        Upload
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .file-upload-container { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; margin-top: 10px; }
    .file-name { font-style: italic; color: #555; }
    .error { color: red; margin-top: 10px; }
  `]
})
export class UploadDocumentDialogComponent {
  selectedFile: File | null = null;
  isUploading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<UploadDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claimId: number },
    private documentService: DocumentService
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
    this.errorMessage.set('');
  }

  upload() {
    if (!this.selectedFile) return;

    this.isUploading.set(true);
    this.documentService.uploadDocument(this.selectedFile, this.data.claimId).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set('Upload failed. Please try again.');
        console.error(err);
      }
    });
  }
}
