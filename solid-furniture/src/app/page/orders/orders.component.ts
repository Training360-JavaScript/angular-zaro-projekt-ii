import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  allOrders$: Observable<Order[]> = this.oService.getAll()
  orderKeys: string[] = Object.keys(new Order())
  searchKey: string = 'id'
  keyword: string = ''
  keywordMin: string = ''
  keywordMax: string = ''

  constructor(
    private oService: OrderService, private router: Router) {
      this.sumAmount()
      this.countID()
    }

  ngOnInit(): void {
    this.orderKeys.length = 5;
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
    this.allOrders$.subscribe(
      orders => {
        orders.forEach(order => {
          this.sumAmountCounter += order.amount
        })
      }
    )
  }

  IDCounter: number = 0
  countID(): void {
    this.allOrders$.subscribe(
      orders => {
        orders.forEach(order => {
          this.IDCounter ++
        })
      }
    )
  }

  onDelete(orderID: number): void {
    if (!confirm('Are you sure?')) { return }

    this.oService.delete(orderID).subscribe(() => {
      this.allOrders$ = this.oService.getAll()
    })
  }

}
