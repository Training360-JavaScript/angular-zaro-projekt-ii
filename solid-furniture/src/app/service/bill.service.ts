import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from '../model/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'bill';

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


  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}${this.endPoint}`)
  }


  get(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}${this.endPoint}/${id}`)
  }


  update(Bill: Bill): Observable<Bill> {
    return this.http.patch<Bill>(`${this.apiUrl}${this.endPoint}/${Bill.id}`, Bill)
  }


  delete(id: number): Observable<Bill> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Bill>(url)
  }


  create(Bill: Bill): Observable<Bill> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, Bill, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }


}
