import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'order';

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


  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}${this.endPoint}`)
  }


  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}${this.endPoint}/${id}`)
  }


  update(Order: Order): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}${this.endPoint}/${Order.id}`, Order)
  }


  delete(id: number): Observable<Order> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Order>(url)
  }


  create(Order: Order): Observable<Order> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, Order, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }



}
