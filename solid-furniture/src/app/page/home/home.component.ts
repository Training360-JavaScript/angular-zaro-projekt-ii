import { BillService } from './../../service/bill.service';
import { CustomerService } from './../../service/customer.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { filter, Observable, toArray, map, reduce, switchMap, } from 'rxjs';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { Bill } from 'src/app/model/bill';
import * as Chartist from 'chartist';


@Component({
  selector: 'app-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private billService: BillService,
  ) { }



  startAnimationForLineChart(chart: any) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data: any) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };


  startAnimationForBarChart(chart: any) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data: any) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };


  listProduct$: Observable<Product[]> = this.productService.getAll();
  listCustomer$: Observable<Customer[]> = this.customerService.getAll();
  listOrder$: Observable<Order[]> = this.orderService.getAll();
  listBill$: Observable<Bill[]> = this.billService.getAll();


  ngOnInit(): void {

    // Aktív termékek száma:
    this.getActiveProductNumber(this.listProduct$).subscribe((active: number) => this.activeProductNumber = active);

    // Aktív vásárlók száma:
    this.getActiveCustomerNumber(this.listCustomer$).subscribe((active: number) => this.activeCustomerNumber = active);

    // Még nem fizetett rendelések száma:
    this.getUnpaidOrderNumber(this.listOrder$).subscribe((unpaid: number) => this.unpaidOrderNumber = unpaid);


    this.getUnpaidBillSum(this.listBill$).subscribe((unpaidBillSum: number) => this.unpaidBillSum = unpaidBillSum);

    // // *Számlák összege státuszuk szerint
    // this.billByStatus = this.getBillByStatus(this.listBill$);

    // //* Rendelések száma és mennyiségük összege státuszuk szerint
    // this.orderByStatus = this.getOrderByStatus(this.listOrder$);



    // Grafikonok rajzolása -----------------------------------------------


    this.listOrder$.subscribe((allOrderArray: Order[]) => {

      // Rendelések státusz szerinti száma és megoszlása
      const orderNumberByStatusObj: any = {};
      allOrderArray.map((order: Order) => orderNumberByStatusObj[order.status] = (orderNumberByStatusObj[order.status] || 0) + 1);

      this.showOrderPieChart(orderNumberByStatusObj);
      this.showOrderBarCart(orderNumberByStatusObj);


      // Az utolsó 10 értékesítés bevétele, a bevétel kommulált összege és a százalékos növekedése
      const observedRange: number = 10;
      const observedOrderArray = allOrderArray.slice(-observedRange);

      const observedIntevallum = observedOrderArray.map((order: Order) => order.id);
      const lastIncome = observedOrderArray.map((order: Order) => (order.amount * Number(order.product?.price)));

      const cumulativeSum: number[] = [];
      lastIncome.forEach((val, i) => (cumulativeSum[i] = Number(val) + cumulativeSum[i - 1] || Number(val)));

      this.showLastOrderIncome(observedIntevallum, lastIncome)
      this.showLastOrderCumulativeSum(observedIntevallum, cumulativeSum)

      this.increasePercent = ~~((cumulativeSum[observedRange - 1] - cumulativeSum[0]) / cumulativeSum[0] * 100)


      // A legutolsó 5 megrendelés szűrt adatai
      this.newOrder_data$ = this.getLatestOrderObj(allOrderArray, 5);

    });


    this.listBill$.subscribe((billArray: Bill[]) => {

      // Mérlegadatok számítása
      const billObj = this.getBillObj(billArray);   // Mérlegadatok objektuma.
      this.incomeBillSum = billObj.paid;            // Kifizetett számlák összege (bevétel).
      this.newBillSum = billObj.new;                // Új számlák összege (követelés).
      this.allBillSum = billObj.new + billObj.paid; // Teljes számlázott összeg.

    });


    this.listProduct$.subscribe((allProductArray: Product[]) => {
      // Aktív termékek száma:
      //this.activeProductNumber = allProductArray.filter((product: Product) => product.active === true).length;

      // Termékek kategóriák szerinti száma | diagram
      const productNumberByCategoryObj = this.getProductNumberByCategoryObj(allProductArray);
      this.showProductRangePieChart(productNumberByCategoryObj);
      this.showProductRangeBarCart(productNumberByCategoryObj);

    });


  }
  //onInit -----------------------------------------------------------------------





  // Legutolsó megrendelések szűrt adatait tartalmazó objektum
  private getLatestOrderObj(allOrderArray: Order[], latestRange: number) {
    return allOrderArray.slice(-latestRange).reverse().map((order: Order) => ({
      id: order.id,
      fullName: `${order.customer?.firstName} ${order.customer?.lastName}`,
      income: order.amount * Number(order.product?.price),
      country: order.customer?.address.country
    })
    );
  }


  // Mérlegadatok számításához a számlák objektuma
  private getBillObj(billArray: Bill[]): { new: number, paid: number } {
    const billObj = { new: 0, paid: 0 };
    billArray.forEach((bill: Bill) => {
      if (bill.status === 'new') {
        billObj.new = billObj.new + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
      }
      if (bill.status === 'paid') {
        billObj.paid = billObj.new + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
      }
    });
    return billObj;
  }


  // Termékek kategóriák szerinti számát tartalmazó objaktum
  private getProductNumberByCategoryObj(allProductArray: Product[]): {} {
    const productNumberByCategoryObj: any = {};
    allProductArray.map((product: Product) => product.category?.name.trim()).sort()
      .map((productCategoryName: any) =>
        productNumberByCategoryObj[productCategoryName] = (productNumberByCategoryObj[productCategoryName] || 0) + 1);
    return productNumberByCategoryObj;
  };







  // Számértékek a Dashboard-ra
  activeProductNumber: number = 0;


  orderNumberByStatus_data$: any;
  lastFiveOrderArray: any;

  increasePercent: number = 0;

  incomeBillSum: any;
  newBillSum: any;
  allBillSum: any;




  newOrder_data$: any;
  // shippedOrder_data: any;
  // paidOrder_data: any;
  // orderSum_data: any;





  // showLastOrderIncome
  showLastOrderIncome(dataX?: any, dataY?: any) {
    const data: any = {
      labels: dataX,
      series: [dataY]
    };

    const optionslastOrderIncome = {
      axisX: {
        showGrid: false
      },
      axisY: {
        offset: 80,
        labelInterpolationFnc: function (value: any) {
          return value / 1000 + 'k EUR'
        },
        scaleMinSpace: 15
      },
      low: 0,
      chartPadding: { top: 25, right: 0, bottom: 0, left: 0 },
    };
    const responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value: any) {
            return value[0];
          }
        }
      }]
    ];
    const lastOrderIncome = new Chartist.Bar('#lastOrderIncome', data, optionslastOrderIncome, responsiveOptions);
    lastOrderIncome;
    //this.startAnimationForBarChart(lastOrderIncome);
  }

  // showLastOrderDetail
  showLastOrderCumulativeSum(dataX?: any, dataY?: any) {
    const data: any = {
      labels: dataX,
      series: [dataY]
    };

    const optionsOrderCumulativeSum: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 2
      }),
      low: 0,
      chartPadding: { top: 25, right: 0, bottom: 0, left: 0 },

      axisY: {
        offset: 80,
        labelInterpolationFnc: function (value: any) {
          return value / 1000 + 'k EUR'
        },
        scaleMinSpace: 15
      }
    }

    const lastOrderCumulativeSum = new Chartist.Line('#lastOrderCumulativeSum', data, optionsOrderCumulativeSum);

    lastOrderCumulativeSum;
    //this.startAnimationForLineChart(lastOrderCumulativeSum);
  }


  //----------------------------------------------------------------------------
  showProductRangePieChart(productNumberByCategoryObj: { [key: string]: number }) {
    const data = {
      series: Object.values(productNumberByCategoryObj)
    };
    const options = {
      chartPadding: 25,
      labelOffset: 42,
      labelInterpolationFnc: function (value: any, idx: any) {
        return Math.round(data.series[idx] / data.series.reduce((a, b) => a + b) * 100) + '%';
      }
    };
    new Chartist.Pie('#productRangePieChart', data, options);
  }


  showProductRangeBarCart(productNumberByCategoryObj: { [key: string]: number }) {
    const data = {
      labels: Object.keys(productNumberByCategoryObj),
      series: [Object.values(productNumberByCategoryObj)]
    };
    const options = {
      seriesBarDistance: 15,
      reverseData: true,
      horizontalBars: true,
      axisX: {
        labelInterpolationFnc: function (value: any, index: number) {
          return index % 1 === 0 ? value : null;
        },
      },
      axisY: {
        offset: 90
      },
      chartPadding: { top: 20, right: 15, bottom: -5, left: 0 }
    };
    new Chartist.Bar('#productRangeBarCart', data, options);
  }


  // Beégetett felíratnevek kiváltava
  showOrderPieChart(orderNumberByStatusObj: { [key: string]: number }) {
    const data = {
      labels: Object.keys(orderNumberByStatusObj),
      series: Object.values(orderNumberByStatusObj)
    };
    const options = {
      chartPadding: 25,
      labelOffset: 50,
      labelInterpolationFnc: function (value: any, idx: any) {
        return value + " - " + Math.round(data.series[idx] / data.series.reduce((a, b) => a + b) * 100) + '%';
      }
    };
    new Chartist.Pie('#OrderNumberByStatusPieChart', data, options);
  }

  // Beégetett felíratnevek kiváltava
  showOrderBarCart(orderNumberByStatusObj: { [key: string]: number }) {
    const data = {
      labels: Object.keys(orderNumberByStatusObj),
      series: [Object.values(orderNumberByStatusObj)]
    };
    const options = {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: true,
      axisX: {
        labelInterpolationFnc: function (value: any, index: number) {
          return index % 2 === 0 ? value : null;
        },
      },
      axisY: {
        offset: 60
      },
      chartPadding: { top: 20, right: 15, bottom: -5, left: 0 }
    };
    new Chartist.Bar('#orderByStatus', data, options);
  }



  // getProductNumberByCategory(allProduct$: Observable<Product[]>): any {
  //   const result = [0, 0, 0, 0, 0];
  //   return allProduct$.pipe(
  //     map((list: Product[]) => list.map(
  //       product => {
  //         if (product.catID === 1) result[0]++;
  //         if (product.catID === 2) result[1]++;
  //         if (product.catID === 3) result[2]++;
  //         if (product.catID === 4) result[3]++;
  //         if (product.catID === 5) result[4]++;
  //         return result
  //       }
  //     )[0])
  //   )
  //   //.subscribe(console.log)
  // }




  // _getOrderNumberByStatus(orderByStatus: any): any {

  //   return [orderByStatus.new.amountSum, orderByStatus.paid.amountSum, orderByStatus.shipped.amountSum]
  // }

  // getOrderNumberByStatus(order$: Observable<Order[]>): Observable<any> {
  //   const result = [0, 0, 0];
  //   return order$.pipe(
  //     map((list: Order[]) => list.map(
  //       order => {
  //         if (order.status === 'new') result[0]++;
  //         if (order.status === 'shipped') result[1]++;
  //         if (order.status === 'paid') result[2]++;
  //         return result
  //       }
  //     )[0]),
  //   );
  //   //.subscribe(console.log)
  // }


  // Aktív termékek száma:
  //activeProductNumber: number = 0;
  getActiveProductNumber(product$: Observable<Product[]>): any {
    return product$.pipe(
      switchMap((list: Product[]) => list),
      filter((product: Product) => product.active === true),
      toArray(),
      map(activeProductArray => activeProductArray.length),
    )
  }

  // Aktív vásárlók száma:
  activeCustomerNumber: number = 0;
  getActiveCustomerNumber(customer$: Observable<Customer[]>): any {
    return customer$.pipe(
      switchMap((list: Customer[]) => list),
      filter((customer: Customer) => customer.active === true),
      toArray(),
      map(activeCustomerArray => activeCustomerArray.length),
    )
  }


  // Még nem fizetett rendelések száma.
  unpaidOrderNumber: number = 0;
  getUnpaidOrderNumber(order$: Observable<Order[]>): any {
    return order$.pipe(
      switchMap((list: Order[]) => list),
      filter((order: Order) => order.status != 'paid'),
      toArray(),
      map(unpaidOrderArray => unpaidOrderArray.length),
    )
  }


  // Még nem fizetett számlák összege.
  unpaidBillSum: number = 0;
  getUnpaidBillSum(bill$: Observable<Bill[]>): any {
    return bill$.pipe(
      switchMap((list: Bill[]) => list),
      filter((bill: Bill) => bill.status != 'paid'),
      map(bill => [bill.amount || 0, bill.order?.amount || 0, bill.order?.product?.price || 0]),
      map(([billAmount, orderAmount, productPrice]) => billAmount * orderAmount * productPrice),
      reduce((acc, val) => acc + val)
    )
    //.subscribe(x => console.log(x))
  }


  // // *Számlák összege státuszuk szerint
  // // Tovább lehet fejleszteni mélyebb szűréssel.
  // billByStatus: {} = {};
  // getBillByStatus(bill$: Observable<Bill[]>): any {
  //   const orderObj = {
  //     new: 0,
  //     paid: 0,
  //   };
  //   bill$.forEach((billArray) => {
  //     billArray.forEach(bill => {
  //       if (bill.status === 'new') {
  //         orderObj.new = + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
  //       }
  //       if (bill.status === 'paid') {
  //         orderObj.paid = + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
  //       }
  //     });
  //   });
  //   return orderObj;
  // }


  // // *Rendelések száma és mennyiségük összege státuszuk szerint
  // orderByStatus: {} = {};
  // getOrderByStatus(order$: Observable<Order[]>): any {
  //   const innerObj = { orderNumber: 0, amountSum: 0 };
  //   const resultObj = {
  //     new: { ...innerObj },
  //     shipped: { ...innerObj },
  //     paid: { ...innerObj },
  //   };
  //   order$.forEach((orderArray) => {
  //     orderArray.forEach(order => {
  //       if (order.status === 'new') {
  //         resultObj.new.orderNumber++;
  //         resultObj.new.amountSum += order.amount;
  //       }
  //       if (order.status === 'shipped') {
  //         resultObj.shipped.orderNumber++;
  //         resultObj.shipped.amountSum += order.amount;
  //       }
  //       if (order.status === 'paid') {
  //         resultObj.paid.orderNumber++;
  //         resultObj.paid.amountSum += order.amount;
  //       }
  //     });
  //   });
  //   //console.log(resultObj)

  //   return (resultObj);
  // }

}
