import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private apiUrl = 'http://localhost:5001/api/expense'; 


  constructor(private http: HttpClient) { }

    getAllExpenses(): Observable<any> {
      return this.http.get<any>(this.apiUrl).pipe(
        catchError((error) => {
          console.error('Error fetching all expenses:', error);
          return throwError(() => new Error(error.message || 'Failed to fetch expenses.'));
        })
      );
    }


  addExpense(expense: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, expense).pipe(
      catchError((error) => {
        console.error('Error adding expense:', error);
        return throwError(() => new Error(error.message || 'Failed to add expense.'));
      })
    );
  }

  updateExpense(id: number, expense: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, expense).pipe(
        catchError((error) => {
          console.error('Error updating expense:', error);
          return throwError(() => new Error(error.message || 'Failed to update expense.'));
        })
      );
    }


  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting expense:', error);
        return throwError(() => new Error(error.message || 'Failed to delete expense.'));
      })
    );
  }

  getExpensesByBudget(budgetId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-budget/${budgetId}`).pipe(
      catchError((error) => {
        console.error('Error fetching expenses by budget:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch expenses for the budget.'));
      })
    );
  }

}
