import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orderKeys: string[] = Object.keys(new Order());
  searchKey: string = 'id';
  keyword: string = '';
  keywordMin: string = '';
  keywordMax: string = '';
  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;
  IDCounter: number = 0;
  sumAmountCounter: number = 0;
  allOrdersForTotal$: Observable<Order[]> = this.orderService.getAll();
  scrollObserver: IntersectionObserver | undefined;
  loadedElements: number = 10;
  stillLoading: boolean = true;

  allOrders$: Observable<Order[]> = this.orderService.getAll().pipe(
    tap((orders) => {
      this.stillLoading = false;
      this.scrollObserver = new IntersectionObserver(
        ([entry]: IntersectionObserverEntry[]) => {
          if (entry.isIntersecting) {
            this.loadedElements = this.loadedElements + 10;
          }
          if (this.loadedElements > orders.length) {
            this.scrollObserver?.disconnect();
          }
        }
      );
      this.scrollObserver.observe(document.querySelector('#scrollAnchor')!);
    })
  );

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.orderKeys.length = 5;
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

  onDelete(orderID: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.orderService.delete(orderID).subscribe(() => {
      this.toastr.error('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allOrders$ = this.orderService.getAll();
    });
  }
}
