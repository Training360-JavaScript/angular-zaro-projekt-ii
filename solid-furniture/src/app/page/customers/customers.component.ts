import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from './../../service/customer.service';
import { Customer } from 'src/app/model/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  scrollObserver: IntersectionObserver | undefined;
  customerKeys: string[] = Object.keys(new Customer());
  searchKey: string = 'firstName';
  keyword: string = '';
  loadedElements: number = 10;

  allCustomers$: Observable<Customer[]> = this.customerService.getAll().pipe(
    tap((customers) => {
      customers.forEach((customer) => {
        this.IDCounter = customers.length;
      });

      this.scrollObserver = new IntersectionObserver(
        ([entry]: IntersectionObserverEntry[]) => {
          if (entry.isIntersecting) {
            this.loadedElements = this.loadedElements + 10;
          }
          if (this.loadedElements > customers.length) {
            this.scrollObserver?.disconnect();
          }
        }
      );
      this.scrollObserver.observe(document.querySelector('#scrollAnchor')!);
    })
  );

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
    /*
  ngOnInit(): void {
    this.allCustomers$.subscribe(
      customers => {
        customers.forEach(customer => {
          this.IDCounter++
        })
      }
    )
  }*/

  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

  sorting(key: string): void {
    key === this.sortKey ? this.clickCounter++ : (this.clickCounter = 0);
    this.sortDirection = this.clickCounter % 2 ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = ''
    //this.countID()
  }

  /*
  add300(): void {
    for (let i = 0; i < 300; i++) {
      this.customerService.create({
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
    /*
    this.allCustomers$.subscribe(
      customers => {
        this.IDCounter = 0
        let tds = document.querySelectorAll('tr')
        tds.forEach(td => {
          this.IDCounter++
        })
        this.IDCounter = this.IDCounter - 2
      }
    )*/
  }

  onDelete(customerID: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.customerService.delete(customerID).subscribe(() => {
      this.toastr.success('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allCustomers$ = this.customerService.getAll();
    });
  }
}
