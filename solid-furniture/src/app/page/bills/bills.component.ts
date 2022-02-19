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
  showBillDetail: boolean = false
  myBill!: Bill

  constructor(
    private bService: BillService, private router: Router) {
    this.sumAmount()
    this.countID()
  }

  ngOnInit(): void {
    this.billKeys.length = 4;
    this.allBills$.subscribe(
      bills => {
        bills.forEach(bill => {
          this.sumAmountCounter += bill.amount
        })
        bills.forEach(bill => {
          this.IDCounter++
        })
      }
    )
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
    this.total()
  }

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
    this.total()
  }

  total(): void {
    this.sumAmount()
    this.countID()
  }

  sumAmountCounter: number = 0
  sumAmount(): void {
    this.allBills$.subscribe(
      bills => {
        this.sumAmountCounter = 0
        let amountTds = document.querySelectorAll('.amount')
        amountTds.forEach(td => {
          this.sumAmountCounter += Number(td.innerHTML)
        })
      }
    )
  }

  IDCounter: number = 0
  countID(): void {
    this.allBills$.subscribe(
      bills => {
        this.IDCounter = 0
        let tds = document.querySelectorAll('tr')
        tds.forEach(td => {
          this.IDCounter++
        })
        this.IDCounter = this.IDCounter - 2
      }
    )
  }

  onDelete(billID: number): void {
    if (!confirm('Are you sure?')) { return }

    this.bService.delete(billID).subscribe(() => {
      this.allBills$ = this.bService.getAll()
    })
  }

  billDetail(billID: number): void {
    console.log(this.myBill)
    this.showBillDetail = true
    this.bService.get(billID).subscribe(
      bill => {
        this.myBill = bill
      }
    )
      console.log('itt van:')
      console.log(this.myBill.order?.amount)
  }


}
