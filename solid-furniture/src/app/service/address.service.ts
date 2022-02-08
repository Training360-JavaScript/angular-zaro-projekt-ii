import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'address';

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


  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}${this.endPoint}`)
  }

  // A get id nélkül hogy fog működni?
  // get(id: number): Observable<Address> {
  //   return this.http.get<Address>(`${this.apiUrl}${this.endPoint}/${id}`)
  // }

  // Az update id nélkül hogy fog műküdni?
  // update(Address: Address): Observable<Address> {
  //   return this.http.patch<Address>(`${this.apiUrl}${this.endPoint}/${Address.id}`, Address)
  // }

  // A delete id nélkül hogy fog működni?
  // delete(id: number): Observable<Address> {
  //   const url = `${this.apiUrl}${this.endPoint}/${id}`;
  //   return this.http.delete<Address>(url)
  // }


  create(Address: Address): Observable<Address> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, Address, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }




}
