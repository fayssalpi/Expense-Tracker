import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private apiUrl = 'http://localhost:5001/api/expense'; 


  constructor(private http: HttpClient) { }

    getAllExpenses(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }


  addExpense(expense: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, expense);
  }

    updateExpense(id: number, expense: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, expense);
    }


  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getExpensesByBudget(budgetId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-budget/${budgetId}`);
  }




}
