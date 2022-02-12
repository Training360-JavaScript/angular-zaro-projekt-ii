import { Router } from '@angular/router';
import { Customer } from './../../model/customer';
import { CustomerService } from './../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  allCustomers$: Observable<Customer[]> = this.customerService.getAll();

  ngOnInit(): void {}

  addCustomer() {
    this.router.navigate(['/customers', 0]);
  }

  editCustomer(id: number) {
    this.router.navigate(['/customers', id]);
  }

  deleteCustomer(id: number) {
    this.customerService.delete(id).subscribe((success) => {
      this.allCustomers$ = this.customerService.getAll();
    });
  }
}
