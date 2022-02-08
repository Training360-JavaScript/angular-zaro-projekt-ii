import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'product';

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


  update(Product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}${this.endPoint}/${Product.id}`, Product)
  }


  delete(id: number): Observable<Product> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Product>(url)
  }


  create(Product: Product): Observable<Product> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, Product, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }


}
