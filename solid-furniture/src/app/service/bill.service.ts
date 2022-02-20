import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from '../model/bill';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class BillService extends BaseService<Bill> {
  // apiUrl: string = environment.apiUrl;
  // endPoint: string = 'bill';

  // url: string = `${this.apiUrl}${this.endPoint}`;

  constructor(
    public override http: HttpClient,
    private orderService: OrderService
  ) {
    super(http);
    this.entityName = 'bill';
  }

  override get(id: number): Observable<Bill> {
    const bill$ = super.get(id).pipe(
      switchMap((bill) => {
        return this.orderService.get(bill.orderID).pipe(
          map((order) => {
            bill.order = order;
            return bill;
          })
        );
      })
    );
    return bill$;
  }

  override getAll(): Observable<Bill[]> {
    const allBill$ = super.getAll();
    const allOrder$ = this.orderService.getAll();

    const allFullBill$ = forkJoin([allBill$, allOrder$]).pipe(
      map(([billList, orderList]) => {
        billList.map((bill) => {
          const order = orderList.find((order) => order.id === bill.orderID);
          bill.order = order;
        });
        return billList;
      })
    );

    return allFullBill$;
  }
}
