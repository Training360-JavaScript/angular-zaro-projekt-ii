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
    //total numbers in initialization
    this.allOrders$.subscribe(
      orders => {
        orders.forEach(order => {
          this.sumAmountCounter += order.amount
        })
        orders.forEach(order => {
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
    this.allOrders$.subscribe(
      orders => {
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
    this.allOrders$.subscribe(
      orders => {
        this.IDCounter = 0
        let tds = document.querySelectorAll('tr')
        tds.forEach(td => {
          this.IDCounter++
        })
        this.IDCounter = this.IDCounter - 2
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
