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
    console.log(Customer)
    return this.http.post<any>(this.url, Customer, this.httpOptions)
  }

}
