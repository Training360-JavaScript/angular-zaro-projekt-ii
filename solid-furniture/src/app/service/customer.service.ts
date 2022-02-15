import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'customer';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url)
  }

  get(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`)
  }

  update(Customer: Customer): Observable<Customer> {
    return this.http.patch<Customer>(`${this.url}/${Customer.id}`, Customer)
  }

  delete(id: number): Observable<Customer> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Customer>(url)
  }

  create(Customer: Customer): Observable<Customer> {
    return this.http.post<any>(this.url, Customer, this.httpOptions)
  }

}
/*
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiUrl: string = environment.apiUrl;
  endPoint: string = 'customer';

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

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }

  get(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  update(Customer: Customer): Observable<Customer> {
    return this.http.patch<Customer>(`${this.url}/${Customer.id}`, Customer);
  }

  delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.url}/${id}`);
  }

  create(Customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.url, Customer);
  }
}
*/
