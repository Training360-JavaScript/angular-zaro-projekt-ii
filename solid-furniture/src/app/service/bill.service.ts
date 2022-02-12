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
