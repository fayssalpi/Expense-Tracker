import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5001/api/category'; // Endpoint for category operations


  constructor(private http: HttpClient) { }


   /**
   * Get categories for the logged-in user.
   * @returns Observable containing the list of categories
   */
   getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Sends GET request to fetch categories
  }

  /**
   * Add a new category for the logged-in user.
   * @param category The category to be added
   * @returns Observable with the response from the server
   */
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category); // Sends POST request to add category
  }


}
