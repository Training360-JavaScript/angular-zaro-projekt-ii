import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'product';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url)
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`)
  }

  update(Product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${Product.id}`, Product)
  }

  delete(id: number): Observable<Product> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Product>(url)
  }

  create(Product: Product): Observable<Product> {
    return this.http.post<any>(this.url, Product, this.httpOptions)
  }

}

/*
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = environment.apiUrl;
  endPoint: string = 'product';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  url = `${this.apiUrl}${this.endPoint}`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  update(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${product.id}`, product);
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.url}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }
}
*/
