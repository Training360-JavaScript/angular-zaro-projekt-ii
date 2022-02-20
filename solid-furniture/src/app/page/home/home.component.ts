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

  // listCategory$: Observable<Category[]> = this.categoryService.getAll();
  //  oneCategory$: Observable<Category> = this.categoryService.get(2);

  //listAddress$: Observable<Address[]> = this.addressService.getAll();
  //  oneAddress$: Observable<Address> = this.addressService.get(5);

  listProduct$: Observable<Product[]> = this.productService.getAll();
  //  oneProduct$: Observable<Product> = this.productService.get(4);

  listCustomer$: Observable<Customer[]> = this.customerService.getAll();
  //oneCustomer$: Observable<Customer> = this.customerService.get(1);

  listOrder$: Observable<Order[]> = this.orderService.getAll();
  //oneOrder$: Observable<Order> = this.orderService.get(2);

  listBill$: Observable<Bill[]> = this.billService.getAll();
  //eBill$: Observable<Bill> = this.billService.get(15);


  ngOnInit(): void {

    // Aktív termékek száma:
    this.getActiveProductNumber(this.listProduct$).subscribe((active: number) => this.activeProductNumber = active);


    // Aktív vásárlók száma:
    this.getActiveCustomerNumber(this.listCustomer$).subscribe((active: number) => {
      this.activeCustomerNumber = active
      //console.log(this.activeCustomerNumber)
    });


    // Még nem fizetett rendelések száma:
    this.getUnpaidOrderNumber(this.listOrder$).subscribe((unpaid: number) => {
      this.unpaidOrderNumber = unpaid
      //console.log(this.unpaidOrderNumber)
    });


    this.getUnpaidBillSum(this.listBill$).subscribe((unpaidBillSum: number) => {
      this.unpaidBillSum = unpaidBillSum
      //console.log(this.unpaidBillSum)
    });

    // *Számlák összege státuszuk szerint
    this.billByStatus = this.getBillByStatus(this.listBill$);

    //* Rendelések száma és mennyiségük összege státuszuk szerint
    this.orderByStatus = this.getOrderByStatus(this.listOrder$);



    // Grafikonok rajzolása -----------------------------------------------

    this.getOrderNumberByStatus(this.listOrder$).subscribe((orderNumberByStatus: number[]) => {
      this.showOrderPieChart(orderNumberByStatus);
      this.showOrderBarCart(orderNumberByStatus);
      this.orderNumberByStatus_data$ = orderNumberByStatus;
      //console.log(orderNumberByStatus)
    });

    this.getProductNumberByCategory(this.listProduct$).subscribe((productNumberByCategory: number[]) => {
      //console.log(productNumberByCategory);
      this.showProductRangePieChart(productNumberByCategory);
      this.showProductRangeBarCart(productNumberByCategory);
    });

    this.listOrder$.subscribe(allOrderArray => {
      let observedIntevallum = allOrderArray.slice(-10).map(item => item.id);
      allOrderArray = allOrderArray.slice(-10);
      let lastIncome = allOrderArray.map(item => (item.amount * Number(item.product?.price)));
      let cumulativeSum = [0];
      lastIncome.forEach((val, i) => (cumulativeSum[i] = Number(val) + cumulativeSum[i - 1] || Number(val)));
      this.showLastOrderIncome(observedIntevallum, lastIncome)
      this.showLastOrderCumulativeSum(observedIntevallum, cumulativeSum)

      // console.log(cumulativeSum)
      // console.log(lastIncome)

      let lastFiveOrderArray = allOrderArray.slice(-5).reverse();
      const newTampe = { id: 0, fullName: '', income: '', country: '' }

      let newObj = lastFiveOrderArray.map(x => ({
        id: x.id,
        fullName: `${x.customer?.firstName} ${x.customer?.lastName}`,
        income: x.amount * Number(x.product?.price),
        country: x.customer?.address.country
      })
      )

      //console.log(newObj)

      this.lastFiveOrderArray = lastFiveOrderArray;
      //console.log(lastFiveOrderArray);


      this.newOrder_data$ = newObj;
    });


    this.listBill$.subscribe(list => {
      const billObj = {
        new: 0,
        paid: 0,
      };
      list.forEach(bill => {
        if (bill.status === 'new') {
          billObj.new = billObj.new + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
        }
        if (bill.status === 'paid') {
          billObj.paid = billObj.new + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
        }
      })
      // console.log(list)
      // console.log(billObj)

      this.newBillSum = billObj.new;
      this.incomeBillSum = billObj.paid;
      this.allBillSum = billObj.new + billObj.paid;
    })


    this.listProduct$.subscribe(list => {
      // let newList = list.filter(x => x.catID > 4);
      // console.log(list)
      // console.log(newList)
    })

















  }
  //onInit -----------------------------------------------------------------------

  // Számértékek a Dashboard-ra
  orderNumberByStatus_data$: any;
  lastFiveOrderArray: any;

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
    this.startAnimationForBarChart(lastOrderIncome);
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

    //lastOrderCumulativeSum;
    this.startAnimationForLineChart(lastOrderCumulativeSum);
  }


  //----------------------------------------------------------------------------
  showProductRangePieChart(orderData: number[]) {
    const data = {
      series: [orderData[0], orderData[1], orderData[2], orderData[3], orderData[4]]
    };

    const options = {
      labelInterpolationFnc: function (value: any, idx: any) {
        return Math.round(data.series[idx] / data.series.reduce((a, b) => a + b) * 100) + '%';
      }
    };

    new Chartist.Pie('#productRangePieChart', data, options);
  }


  showProductRangeBarCart(orderData: number[]) {
    const data = {
      labels: ['Living room', 'Bedroom', 'Bathroom', 'Home office', 'Dining room'],
      series: [[orderData[0], orderData[1], orderData[2], orderData[3], orderData[4]]]
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

    const productRangeBarCart = new Chartist.Bar('#productRangeBarCart', data, options);
  }



  showOrderPieChart(orderData: number[]) {
    const data = {
      labels: ['new', 'shipped', 'paid'],
      series: [orderData[0], orderData[1], orderData[2]]
    };

    const options = {
      chartPadding: 15,
      labelOffset: 45,
      labelInterpolationFnc: function (value: any, idx: any) {
        return value + " - " + Math.round(data.series[idx] / data.series.reduce((a, b) => a + b) * 100) + '%';
      }
    };
    new Chartist.Pie('#OrderNumberByStatusPieChart', data, options);
  }


  showOrderBarCart(orderData: any) {
    const data = {
      labels: ['new', 'shipped', 'paid'],
      series: [[orderData[0], orderData[1], orderData[2]]]
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



  getProductNumberByCategory(allProduct$: Observable<Product[]>): any {
    const result = [0, 0, 0, 0, 0];
    return allProduct$.pipe(
      map((list: Product[]) => list.map(
        product => {
          if (product.catID === 1) result[0]++;
          if (product.catID === 2) result[1]++;
          if (product.catID === 3) result[2]++;
          if (product.catID === 4) result[3]++;
          if (product.catID === 5) result[4]++;
          return result
        }
      )[0])
    )
    //.subscribe(console.log)
  }




  _getOrderNumberByStatus(orderByStatus: any): any {

    return [orderByStatus.new.amountSum, orderByStatus.paid.amountSum, orderByStatus.shipped.amountSum]
  }

  getOrderNumberByStatus(order$: Observable<Order[]>): Observable<any> {
    const result = [0, 0, 0];
    return order$.pipe(
      map((list: Order[]) => list.map(
        order => {
          if (order.status === 'new') result[0]++;
          if (order.status === 'shipped') result[1]++;
          if (order.status === 'paid') result[2]++;
          return result
        }
      )[0]),
    );
    //.subscribe(console.log)
  }


  // Aktív termékek száma:
  activeProductNumber: number = 0;
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


  // *Számlák összege státuszuk szerint
  // Tovább lehet fejleszteni mélyebb szűréssel.
  billByStatus: {} = {};
  getBillByStatus(bill$: Observable<Bill[]>): any {
    const orderObj = {
      new: 0,
      paid: 0,
    };
    bill$.forEach((billArray) => {
      billArray.forEach(bill => {
        if (bill.status === 'new') {
          orderObj.new = + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
        }
        if (bill.status === 'paid') {
          orderObj.paid = + (bill.amount || 0) * (bill.order?.amount || 0) * (bill.order?.product?.price || 0)
        }
      });
    });
    return orderObj;
  }


  // *Rendelések száma és mennyiségük összege státuszuk szerint
  orderByStatus: {} = {};
  getOrderByStatus(order$: Observable<Order[]>): any {
    const innerObj = { orderNumber: 0, amountSum: 0 };
    const resultObj = {
      new: { ...innerObj },
      shipped: { ...innerObj },
      paid: { ...innerObj },
    };
    order$.forEach((orderArray) => {
      orderArray.forEach(order => {
        if (order.status === 'new') {
          resultObj.new.orderNumber++;
          resultObj.new.amountSum += order.amount;
        }
        if (order.status === 'shipped') {
          resultObj.shipped.orderNumber++;
          resultObj.shipped.amountSum += order.amount;
        }
        if (order.status === 'paid') {
          resultObj.paid.orderNumber++;
          resultObj.paid.amountSum += order.amount;
        }
      });
    });
    //console.log(resultObj)

    return (resultObj);
  }




  valtozo: any






}
