import { OrderService } from './../../service/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.scss'],
})
export class EditOrdersComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  orderForm = this.formBuilder.group({
    id: [''],
    customerID: [this.generateID()],
    productID: [this.generateID()],
    amount: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    status: ['new', [Validators.required]],
  });

  disabled: boolean = true;
  isDelHidden: boolean = true;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id'] !== '0') {
            this.isDelHidden = false;
            return this.orderService.get(params['id']);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe((bill) => {
        delete bill.customer;
        delete bill.product;
        this.orderForm.setValue(bill);
      });
  }

  onDelete() {
    if (!confirm('Are you sure?')) {
      return;
    }
    let id = this.orderForm.value.id;
    if (id) {
      this.orderService.delete(id).subscribe(() => {
        this.router.navigate(['/orders']);
        this.toastr.success('Order has been removed!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }

  onUpdate() {
    if (this.orderForm.value.id) {
      this.orderService.update(this.orderForm.value).subscribe(() => {
        this.router.navigate(['/orders']);
        this.toastr.success('Order has been updated!', 'Success', {
          timeOut: 3000,
        });
      });
    } else {
      this.orderService.create(this.orderForm.value).subscribe(() => {
        this.router.navigate(['/orders']);
        this.toastr.success('Order has been added!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }
  goBack() {
    this.router.navigate(['/orders']);
  }
  generateID() {
    return Math.floor(Math.random() * 10e10);
  }
  get amount() {
    return this.orderForm.get('amount');
  }
}
