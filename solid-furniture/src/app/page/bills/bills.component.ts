import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Bill } from './../../model/bill';
import { BillService } from 'src/app/service/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit, OnDestroy {
  billKeys: string[] = Object.keys(new Bill());
  searchKey: string = 'id';
  keyword: string = '';
  keywordMin: string = '';
  keywordMax: string = '';
  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;
  IDCounter: number = 0;
  sumAmountCounter: number = 0;
  allBillsForTotal$: Observable<Bill[]> = this.billService.getAll();
  showBillDetail: boolean = false;
  myBill!: Bill;
  loadedElements: number = 10;
  scrollObserver: IntersectionObserver | undefined;
  stillLoading: boolean = true;

  allBills$: Observable<Bill[]> = this.billService.getAll().pipe(
    tap((bills) => {
      this.stillLoading = false;
      this.scrollObserver = new IntersectionObserver(
        ([entry]: IntersectionObserverEntry[]) => {
          if (entry.isIntersecting) {
            this.loadedElements = this.loadedElements + 10;
          }
          if (this.loadedElements > bills.length) {
            this.scrollObserver?.disconnect();
          }
        }
      );
      this.scrollObserver.observe(document.querySelector('#scrollAnchor')!);
    })
  );

  constructor(
    private billService: BillService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.billKeys.length = 4;
  }

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

  clearKeywordMinMax(): void {
    this.keywordMin = '';
    this.keywordMax = '';
  }

  onDelete(billID: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.billService.delete(billID).subscribe(() => {
      this.toastr.error('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allBills$ = this.billService.getAll();
    });
  }

  billDetail(billID: number): void {
    this.showBillDetail = true;
    this.billService.get(billID).subscribe((bill) => {
      this.myBill = bill;
    });
  }
}
