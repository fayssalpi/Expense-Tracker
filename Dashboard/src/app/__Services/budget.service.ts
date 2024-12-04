import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = 'http://localhost:5001/api/budget'; 

  constructor(private http: HttpClient) { }

    /**
   * Get all budgets for the logged-in user
   * @returns Observable of the budgets
   */
    getBudgets(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }


    addBudget(budget: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, budget).pipe(
        catchError((error) => {
          console.error('Error response:', error);
          return throwError(() => new Error(error.error?.message || 'Unknown error occurred'));
        })
      );
    }

      // Method to get the current month budget
  getCurrentMonthBudget(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current-month`);
  }

}
