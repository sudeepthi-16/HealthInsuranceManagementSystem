import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ClaimDocument } from '../models/claim-document';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = `${environment.apiBaseUrl}/Documents`;

    constructor(private http: HttpClient) { }

    uploadDocument(file: File, claimId: number): Observable<ClaimDocument> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('claimId', claimId.toString());

        return this.http.post<ClaimDocument>(`${this.apiUrl}/upload`, formData);
    }

    getDocuments(claimId: number): Observable<ClaimDocument[]> {
        return this.http.get<ClaimDocument[]>(`${this.apiUrl}/claim/${claimId}`);
    }

    downloadDocument(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
    }
}
