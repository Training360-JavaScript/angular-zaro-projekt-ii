import { Category } from './../model/category';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'category';

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


  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}${this.endPoint}`)
  }


  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}${this.endPoint}/${id}`)
  }


  update(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}${this.endPoint}/${category.id}`, category)
  }


  delete(id: number): Observable<Category> {
    const url = `${this.apiUrl}${this.endPoint}/${id}`;
    return this.http.delete<Category>(url)
  }


  create(category: Category): Observable<Category> {
    console.log('create working...');

    const url = `${this.apiUrl}${this.endPoint}`;

    return this.http.post<any>(url, category, this.httpOptions).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }




}
