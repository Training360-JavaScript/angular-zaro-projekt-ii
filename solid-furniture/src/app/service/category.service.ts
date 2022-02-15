import { Category } from './../model/category';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = environment.apiUrl;
  endPoint: string = 'category';

  url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url)
  }

  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`)
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/${category.id}`, category)
  }

  delete(id: number): Observable<Category> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Category>(url)
  }

  create(category: Category): Observable<Category> {
    return this.http.post<any>(this.url, category, this.httpOptions)
  }

}

/*
import { Category } from './../model/category';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl: string = environment.apiUrl;
  endPoint: string = 'category';

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

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  update(Category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/${Category.id}`, Category);
  }

  delete(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.url}/${id}`);
  }

  create(Category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, Category);
  }
}
*/
