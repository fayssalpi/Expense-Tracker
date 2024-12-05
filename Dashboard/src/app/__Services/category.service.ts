import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5001/api/category'; 


  constructor(private http: HttpClient) { }


   getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl); 
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category); 
  }


}
