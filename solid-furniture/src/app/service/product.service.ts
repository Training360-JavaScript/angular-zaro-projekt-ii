import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, forkJoin, switchMap, catchError, of } from 'rxjs';

import { Category } from '../model/category';
import { Product } from '../model/product';
import { BaseService } from './base.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<Product> {
  constructor(
    public html: HttpClient,
    private categoryService: CategoryService
  ) {
    super(html);
    this.entityName = 'product';
  }

  override getAll(): Observable<Product[]> {
    const allProduct$ = super.getAll();
    const allCategory$ = this.categoryService.getAll();

    const allFullProduct$ = forkJoin([allProduct$, allCategory$]).pipe(
      map(([productList, categoryList]) => {
        productList.map((product) => {
          const category =
            categoryList.find((category) => category.id === product.catID) ||
            new Category();
          product.category = category;
        });
        return productList;
      })
    );

    return allFullProduct$;
  }

  override get(id: number): Observable<Product> {
    const product$ = super.get(id).pipe(
      switchMap((product) => {
        return this.categoryService.get(product.catID).pipe(
          map((category) => {
            product.category = category || new Category();
            //console.log(product)
            return product;
          })
        );
      }),
      catchError((error) => {
        // console.log('error ProductService');
        return of(new Product());
      })
    );
    return product$;
  }

  createProductObject(product: Product): Product {
    const newProduct = new Product();
    delete newProduct.category;
    for (const key of Object.keys(newProduct)) {
      newProduct[key] = product[key];
    }
    newProduct.catID = newProduct.catID * 1;
    newProduct.price = newProduct.price * 1;
    return newProduct;
  }

  override update(entity: Product): Observable<Product> {
    const newProduct = this.createProductObject(entity);
    return super.update(newProduct);
  }

  override create(entity: Product): Observable<Product> {
    const newProduct = this.createProductObject(entity);

    //return this.http.patch<Product>(`${this.apiUrl}${this.entityName}/${entity.id}`, newProduct);

    return super.create(newProduct);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }),
  };

  // Nem m??k??dik. A c??lja az lenne, hogy ha t??bb kulcs lenne a szerveren, akkor teljesen fel??l??rja az objektumot,
  // ??gy t??r??lje a felesleges kulcsokat. De nem m??k??dik. A nem odaill?? kulcsok megmaradnak.
  createForce(entity: Product): Observable<Product> {
    //console.log('createForce...')
    const newProduct = this.createProductObject(entity);
    return this.http.put<Product>(
      `${this.apiUrl}${this.entityName}/${entity.id}`,
      newProduct,
      this.httpOptions
    );
    //return this.http.post<Product>(`${this.apiUrl}${this.entityName}`, entity);
    //return this.http.post<Product>(`${this.apiUrl}${this.entityName}`, entity, this.httpOptions);
    //return this.http.post<Product>(`${this.apiUrl}${this.entityName}/${entity.id}`, entity);
    //* return this.http.post<T>(`${this.url}`, entity);
  }
}
