import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'customer';

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


  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}${this.endPoint}`)
  }


  get(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}${this.endPoint}/${id}`)
  }


  update(Customer: Customer): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}${this.endPoint}/${Customer.id}`, Customer)
  }


  delete(id: number): Observable<Customer> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Customer>(url)
  }


  create(Customer: Customer): Observable<Customer> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, Customer, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }


}
