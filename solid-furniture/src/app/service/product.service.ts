import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'products';

  constructor(
    private http: HttpClient
  ) { }


  httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/json'}
    )
  }


  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }


  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}${this.endPoint}`)
  }


  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${this.endPoint}/${id}`)
  }

/*
  update(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}${this.endPoint}/${category.id}`, category)
  }


  delete(id: number): Observable<Category> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Category>(url)
  }


  create(category: Category): Observable<Category> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, category, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }
*/
}
