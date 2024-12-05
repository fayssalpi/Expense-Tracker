import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = 'http://localhost:5001/api/budget'; 

  constructor(private http: HttpClient) { }


    getBudgets(): Observable<any> {
      return this.http.get<any>(this.apiUrl).pipe(
        catchError((error) => {
          console.error('Error fetching budgets:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch budgets.'));
        })
      );
    }


    addBudget(budget: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, budget).pipe(
        catchError((error) => {
          console.error('Error response:', error);
          return throwError(() => new Error(error.error?.message || 'Unknown error occurred'));
        })
      );
    }

  getCurrentMonthBudget(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current-month`);
  }

  incrementMonthlyLimit(budgetId: number, amount: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${budgetId}/increment-monthly-limit`, { amount }).pipe(
      catchError((error) => {
        console.error('Error response:', error);
        return throwError(() => new Error(error.error?.message || 'Unknown error occurred'));
      })
    );
  }
  

}
