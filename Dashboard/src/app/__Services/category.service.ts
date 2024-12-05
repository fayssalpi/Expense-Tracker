import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5001/api/category'; 


  constructor(private http: HttpClient) { }


   getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch categories.'));
      })
    );
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category).pipe(
      catchError((error) => {
        console.error('Error adding category:', error);
        return throwError(() => new Error(error.message || 'Failed to add category.'));
      })
    );
  }


}
