import { CustomerService } from './../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-customers',
  templateUrl: './edit-customers.component.html',
  styleUrls: ['./edit-customers.component.scss'],
})
export class EditCustomersComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  customerForm = this.formBuilder.group({
    id: [''],
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    email: ['', [Validators.required, Validators.email]],
    address: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
    ],
    active: [true],
  });

  isDelHidden: boolean = true;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id'] !== '0') {
            this.isDelHidden = false;
            return this.customerService.get(params['id']);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe((customer) => {
        console.log(customer)
        this.customerForm.setValue(customer)
      });
  }

  onDelete() {
    let id = this.customerForm.value.id;
    if (id) {
      this.customerService.delete(id).subscribe(() => {
        this.router.navigate(['/customers']);
        this.toastr.success('Customer has been removed!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }

  onUpdate() {
    if (this.customerForm.value.id) {
      this.customerService.update(this.customerForm.value).subscribe(() => {
        this.router.navigate(['/customers']);
        this.toastr.success('Customer has been updated!', 'Success', {
          timeOut: 3000,
        });
      });
    } else {
      this.customerService.create(this.customerForm.value).subscribe(() => {
        this.router.navigate(['/customers']);
        this.toastr.success('Customer has been added!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }
  goBack() {
    this.router.navigate(['/customers']);
  }
  get firstName() {
    return this.customerForm.get('firstName');
  }
  get lastName() {
    return this.customerForm.get('lastName');
  }
  get email() {
    return this.customerForm.get('email');
  }
  get address() {
    return this.customerForm.get('address');
  }
}
