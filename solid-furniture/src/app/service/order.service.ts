import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl: string = environment.apiUrl;
  endPoint: string = 'order';

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

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  update(Order: Order): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${Order.id}`, Order);
  }

  delete(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.url}/${id}`);
  }

  create(Order: Order): Observable<Order> {
    return this.http.post<Order>(this.url, Order);
  }
}
