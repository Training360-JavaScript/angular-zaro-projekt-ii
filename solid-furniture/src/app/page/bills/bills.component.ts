import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Bill } from './../../model/bill';
import { BillService } from 'src/app/service/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  allBills$: Observable<Bill[]> = this.bService.getAll()
  billKeys: string[] = Object.keys(new Bill())
  searchKey: string = 'id'
  keyword: string = ''
  keywordMin: string = ''
  keywordMax: string = ''

  constructor(
    private bService: BillService, private router: Router) {
      this.sumAmount()
      this.countID()
    }

  ngOnInit(): void {
    this.billKeys.length = 4;
  }

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

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
  }

  sumAmountCounter: number = 0
  sumAmount(): void {
    this.allBills$.subscribe(
      bills => {
        bills.forEach(bill => {
          this.sumAmountCounter += bill.amount
        })
      }
    )
  }

  IDCounter: number = 0
  countID(): void {
    this.allBills$.subscribe(
      bills => {
        bills.forEach(bill => {
          this.IDCounter ++
        })
      }
    )
  }

  onDelete(billID: number): void {
    if (!confirm('Are you sure?')) { return }

    this.bService.delete(billID).subscribe(() => {
      this.allBills$ = this.bService.getAll()
    })
  }

}
