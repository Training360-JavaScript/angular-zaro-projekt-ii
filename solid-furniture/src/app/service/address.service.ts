import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseService<Address> {

  constructor(
    http: HttpClient
  ) {
    super(http);
    this.entityName = 'address';
  }

}
