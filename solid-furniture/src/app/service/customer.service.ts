import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../model/customer';
import { Address } from '../model/address';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {

  constructor(
    public override http: HttpClient
  ) {
    super(http);
    this.entityName = 'customer';
  }

  createAddress(customer: Customer): Customer {
    customer = new Customer(customer);
    if (typeof customer.address === 'string') {
      const addressParts = String(customer.address).split('|-|');
      customer.address = new Address();
      ['zip', 'country', 'city', 'street', 'notes'].forEach((key, i) => customer.address[key] = addressParts[i])
      return customer;
    }
    return customer;
  }


  override getAll(): Observable<Customer[]> {
    return super.getAll().pipe(
      map(list => {
        return list.map(customer => this.createAddress(customer));
      }),
    );
  }


  override get(id: number): Observable<Customer> {
    return super.get(id).pipe(
      map(customer => this.createAddress(customer)),
      catchError(error => {
        // console.log('error cutomerService');
        return of(new Customer());
      }),
    );
  }


  createCustomerObject(customer: any): Customer {
    const address = [
      customer.address.zip,
      customer.address.country,
      customer.address.city,
      customer.address.street,
      customer.address.notes,
    ].join('|-|');
    customer.address = new String();
    customer.address = ((address).length > 12) ? address : '';
    return customer
  }


  override update(customer: Customer): Observable<Customer> {
    const newCustomer = this.createCustomerObject(customer);
    return super.update(newCustomer);
  }


  override create(customer: Customer): Observable<Customer> {
    const newCustomer = this.createCustomerObject(customer);
    return super.create(newCustomer);
  }


}
