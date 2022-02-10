import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'order';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url)
  }

  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`)
  }

  update(Order: Order): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${Order.id}`, Order)
  }

  delete(id: number): Observable<Order> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Order>(url)
  }

  create(Order: Order): Observable<Order> {
    return this.http.post<any>(this.url, Order, this.httpOptions)
  }

}
