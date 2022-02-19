import { ToastrService } from 'ngx-toastr';
import { Observable, take, tap, last, map } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Bill } from './../../model/bill';
import { BillService } from 'src/app/service/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit, OnDestroy {
  allBills$: Observable<Bill[]> = this.billService.getAll().pipe(
    tap((bills) => {
      bills.forEach((bill) => {
        this.sumAmountCounter += bill.amount;
        this.IDCounter++; // this.IDCounter = bills.length
      });

      this.scrollObserver = new IntersectionObserver(
        ([entry]: IntersectionObserverEntry[]) => {
          //kap egy listát az elemekről, intersectionobserverEntry tömb.
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
  billKeys: string[] = Object.keys(new Bill());
  searchKey: string = 'id';
  keyword: string = '';
  keywordMin: string = '';
  keywordMax: string = '';
  loadedElements: number = 10;
  scrollObserver: IntersectionObserver | undefined;
  sumAmountCounter: number = 0;
  IDCounter: number = 0;

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

  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

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
      this.toastr.success('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allBills$ = this.billService.getAll();
    });
  }
}
