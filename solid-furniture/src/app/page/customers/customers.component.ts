import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from './../../service/customer.service';
import { Customer } from 'src/app/model/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  allCustomers$: Observable<Customer[]> = this.cService.getAll()
  customerKeys: string[] = Object.keys(new Customer())
  searchKey: string = 'firstName'
  keyword: string = ''

  constructor(
    private cService: CustomerService, private router: Router) {
    this.countID()
  }

  ngOnInit(): void { }

  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

  sorting(key: string): void {
    (key === this.sortKey) ? this.clickCounter++ : this.clickCounter = 0;
    this.sortDirection = (this.clickCounter % 2) ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = ''
  }

  /*
  add300(): void {
    for (let i = 0; i < 300; i++) {
      this.cService.create({
        id: 0,
        firstName: 'A 300 spártai',
        lastName: 'katona egyike',
        email: 'thisis@sparta.com',
        address: 'G-3000|-|Greece|-|Sparta|-|Thermopülai-szoros|-|1/A',
        active: false
      })
    }
  }
*/
  IDCounter: number = 0
  countID(): void {
    this.allCustomers$.subscribe(
      customers => {
        customers.forEach(customer => {
          this.IDCounter++
        })
      }
    )
  }

  onDelete(customerID: number): void {
    if (!confirm('Are you sure?')) { return }

    this.cService.delete(customerID).subscribe(() => {
      this.allCustomers$ = this.cService.getAll()
    })
  }

}
