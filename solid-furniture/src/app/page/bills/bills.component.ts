import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Bill } from './../../model/bill';
import { BillService } from './../../service/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  constructor(private billService: BillService, private router: Router) {}

  ngOnInit(): void {}

  allBills$: Observable<Bill[]> = this.billService.getAll();

  createBill() {
    this.router.navigate(['/bills', 0]);
  }

  deleteBill(id: number) {
    this.billService.delete(id).subscribe((success) => {
      this.allBills$ = this.billService.getAll();
    });
  }
  editBill(id: number) {
    this.router.navigate(['/bills', id]);
  }
}
