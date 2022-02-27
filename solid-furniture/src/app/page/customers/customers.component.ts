import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { CustomerService } from './../../service/customer.service';
import { Customer } from 'src/app/model/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  customerKeys: string[] = Object.keys(new Customer());
  searchKey: string = 'firstName';
  keyword: string = '';
  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;
  loadedElements: number = 10;
  scrollObserver: IntersectionObserver | undefined;
  IDCounter: number = 0;
  allCustomersForTotal$: Observable<Customer[]> = this.customerService.getAll();
  stillLoading: boolean = true;

  allCustomers$: Observable<Customer[]> = this.customerService.getAll().pipe(
    tap((customers) => {
      this.stillLoading = false;
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

  ngOnDestroy(): void {
    this.scrollObserver?.disconnect();
  }

  sorting(key: string): void {
    key === this.sortKey ? this.clickCounter++ : (this.clickCounter = 0);
    this.sortDirection = this.clickCounter % 2 ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = '';
  }

  onDelete(customerID: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.customerService.delete(customerID).subscribe(() => {
      this.toastr.error('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allCustomers$ = this.customerService.getAll();
    });
  }
}
