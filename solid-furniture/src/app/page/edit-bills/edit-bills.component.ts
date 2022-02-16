import { BillService } from './../../service/bill.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-bills',
  templateUrl: './edit-bills.component.html',
  styleUrls: ['./edit-bills.component.scss'],
})
export class EditBillsComponent implements OnInit {
  constructor(
    private billService: BillService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  disabled: boolean = true;
  isDelHidden: boolean = true;

  billForm = this.formBuilder.group({
    id: [''],
    orderID: [Math.floor(Math.random() * 10e10)],
    amount: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    status: ['new'],
  });

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id'] !== '0') {
            this.isDelHidden = false;
            return this.billService.get(params['id']);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe((bill) => {
        delete bill.order
        this.billForm.setValue(bill);
      });
  }
  onDelete() {
    let id = this.billForm.value.id;
    if (id) {
      this.billService.delete(id).subscribe(() => {
        this.router.navigate(['/bills']);
        this.toastr.success('Bill has been removed!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }
  onUpdate() {
    this.billService.create(this.billForm.value).subscribe(() => {
      this.router.navigate(['/bills']);
      this.toastr.success('Bill has been added!', 'Success', {
        timeOut: 3000,
      });
    });
  }
  goBack() {
    this.router.navigate(['/bills']);
  }
  get amount() {
    return this.billForm.get('amount');
  }
}
