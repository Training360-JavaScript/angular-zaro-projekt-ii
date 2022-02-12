import { Order } from './../../model/order';
import { OrderService } from './../../service/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  constructor(private orderService: OrderService, private router: Router) {}

  allOrders$: Observable<Order[]> = this.orderService.getAll();

  ngOnInit(): void {}

  createOrder() {
    this.router.navigate(['/orders', 0]);
  }

  editOrder(id: number) {
    this.router.navigate(['/orders', id]);
  }

  deleteOrder(id: number) {
    this.orderService.delete(id).subscribe((success) => {
      this.allOrders$ = this.orderService.getAll();
    });
  }
}
