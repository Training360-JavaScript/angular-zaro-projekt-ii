import { BillService } from './../../service/bill.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-bills',
  templateUrl: './edit-bills.component.html',
  styleUrls: ['./edit-bills.component.scss'],
})
export class EditBillsComponent {
  constructor(
    private billService: BillService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  generatedID: string = '';
  disabled: boolean = true;

  billForm = this.formBuilder.group({
    id: [''],
    orderID: [Math.floor(Math.random() * 10e10)],
    amount: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    status: ['new'],
  });

  onUpdate() {
    this.billService.create(this.billForm.value).subscribe(() => {
      this.router.navigate(['/bills']);
      this.toastr.success('Bill has been added!', 'Success', {
        timeOut: 3000,
      });
    });
  }
  get amount() {
    return this.billForm.get('amount');
  }
}
