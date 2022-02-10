import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'address';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(this.url)
  }

  // A get id nélkül hogy fog működni?
  get(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.url}/${id}`)
  }

  // Az update id nélkül hogy fog műküdni?
  update(Address: Address): Observable<Address> {
    //return this.http.patch<Address>(`${this.url}/${Address.id}`, Address)
    return this.http.patch<Address>(`${this.url}/${Address}`, Address)
  }

  // A delete id nélkül hogy fog működni?
  delete(id: number): Observable<Address> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Address>(url)
  }

  create(Address: Address): Observable<Address> {
    return this.http.post<any>(this.url, Address, this.httpOptions)
  }

}
