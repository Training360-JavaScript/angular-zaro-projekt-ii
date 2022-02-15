import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from '../model/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'bill';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.url)
  }

  get(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.url}/${id}`)
  }

  update(Bill: Bill): Observable<Bill> {
    return this.http.patch<Bill>(`${this.url}/${Bill.id}`, Bill)
  }

  delete(id: number): Observable<Bill> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Bill>(url)
  }

  create(Bill: Bill): Observable<Bill> {
    return this.http.post<any>(this.url, Bill, this.httpOptions)
  }

}


/*
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from '../model/bill';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  apiUrl: string = environment.apiUrl;
  endPoint: string = 'bill';
  url = `${this.apiUrl}${this.endPoint}`;

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

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.url);
  }

  get(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.url}/${id}`);
  }

  update(Bill: Bill): Observable<Bill> {
    return this.http.patch<Bill>(`${this.url}/${Bill.id}`, Bill);
  }

  delete(id: number): Observable<Bill> {
    return this.http.delete<Bill>(`${this.url}/${id}`);
  }

  create(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.url, bill);
  }
}
*/
