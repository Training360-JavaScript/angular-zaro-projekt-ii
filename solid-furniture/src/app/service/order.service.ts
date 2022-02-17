import { Customer } from 'src/app/model/customer';
import { ProductService } from 'src/app/service/product.service';
import { CustomerService } from './customer.service';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, switchMap, map, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';
import { Product } from '../model/product';


@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order> {


  constructor(
    public override http: HttpClient,
    private customerService: CustomerService,
    private productService: ProductService,
  ) {
    super(http);
    this.entityName = 'order';
  }


  override get(id: number): Observable<Order> {
    const order$ = super.get(id).pipe(
      switchMap(order => {
        return this.productService.get(order.productID).pipe(
          map(product => {
            order.product = product || new Product();
            return order
          })
        )
      }),
      switchMap(order => {
        return this.customerService.get(order.customerID).pipe(
          map(customer => {
            // order.customer = new Customer(customer);
            order.customer = customer || new Customer();
            order.customerID = order.customerID * 1;
            order.productID = order.productID * 1;
            return order
          })
        )
      }),
      catchError(error => {
        // console.log('error OrderService');
        return of(new Order());
      }),
    );

    return order$;
  }


  override getAll(): Observable<Order[]> {
    const allOrder$ = super.getAll();
    const allCustomer$ = this.customerService.getAll();
    const allProduct$ = this.productService.getAll();

    const allFullOrder$ = forkJoin([allOrder$, allProduct$, allCustomer$]).pipe(

      map(([orderList, productList, customerList]) => {
        orderList.map(order => {
          const product = productList.find(product => product.id === order.productID * 1) || new Product();
          const customer = customerList.find(customer => customer.id === order.customerID * 1) || new Customer();
          order.product = new Product(product);
          order.customer = new Customer(customer);
          //order.customerID = order.customerID * 1;
          //order.productID = order.productID * 1;
          //console.log(order);
        })
        return orderList;
      })
    )

    return allFullOrder$;
  }


  createOrderObject(order: Order): Order {
    const newOrder = new Order();
    delete newOrder.customer;
    delete newOrder.product;
    for (const key of Object.keys(newOrder)) {
      newOrder[key] = order[key];
    }
    newOrder.customerID = newOrder.customerID * 1;
    newOrder.productID = newOrder.productID * 1;
    return newOrder;
  }


  override update(entity: Order): Observable<Order> {
    const newOrder = this.createOrderObject(entity);
    return super.update(newOrder);
  }


  override create(entity: Order): Observable<Order> {
    const newOrder = this.createOrderObject(entity);
    return this.http.patch<Order>(`${this.apiUrl}${this.entityName}/${entity.id}`, newOrder);
  }


}
