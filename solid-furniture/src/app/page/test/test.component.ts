import { BillService } from './../../service/bill.service';
import { CategoryService } from './../../service/category.service';
import { CustomerService } from './../../service/customer.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { filter, flatMap, Observable, toArray, zipAll, map, reduce, switchMap, of, from, last } from 'rxjs';
import { Customer } from 'src/app/model/customer';
import { Category } from 'src/app/model/category';
import { AddressService } from 'src/app/service/address.service';
import { Address } from 'src/app/model/address';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { Bill } from 'src/app/model/bill';
import { FormControl, FormGroup } from '@angular/forms';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-test',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
    private customerService: CustomerService,
    private addressService: AddressService,
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





  listCategory$: Observable<Category[]> = this.categoryService.getAll();
  oneCategory$: Observable<Category> = this.categoryService.get(2);

  listAddress$: Observable<Address[]> = this.addressService.getAll();
  oneAddress$: Observable<Address> = this.addressService.get(5);

  listProduct$: Observable<Product[]> = this.productService.getAll();
  oneProduct$: Observable<Product> = this.productService.get(4);

  listCustomer$: Observable<Customer[]> = this.customerService.getAll();
  oneCustomer$: Observable<Customer> = this.customerService.get(1);

  listOrder$: Observable<Order[]> = this.orderService.getAll();
  oneOrder$: Observable<Order> = this.orderService.get(2);

  listBill$: Observable<Bill[]> = this.billService.getAll();
  oneBill$: Observable<Bill> = this.billService.get(15);


  // product | reaktív

  newProduct: any;


  group: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    catID: new FormControl(),
    categoryName: new FormControl(),
  });

  setFormGroup(): void {
    for (const key of Object.keys(this.newProduct)) {
      if (this.group.controls[key]) {
        this.group.controls[key].setValue(this.newProduct[key])
      }
    }
    //this.group.controls.name.setValue('sadf')
  }










  ngOnInit(): void {









    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    var dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    var optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value: any) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);




    // this.oneOrder$.subscribe(
    //   x => console.log(x)
    // )

    // this.oneProduct$.subscribe(
    //   x => {
    //     console.log(x);
    //     //this.valtozo = x.category?.name;
    //   }
    // )

    // this.oneProduct$.subscribe(x => {
    //   this.newProduct = x;
    //   this.setFormGroup();
    // })


    //------------

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
      //this.showPieChart(unpaidBillSum)
      //console.log(this.unpaidBillSum)
    });

    // *Számlák összege státuszuk szerint
    this.billByStatus = this.getBillByStatus(this.listBill$);

    //* Rendelések száma és mennyiségük összege státuszuk szerint
    //this.orderByStatus = this.getOrderByStatus(this.listOrder$).new;
    this.orderByStatus = this.getOrderByStatus(this.listOrder$);



    // Grafikonok rajzolása -----------------------------------------------

    //this.showPieChart(this.getOrderByStatus(this.listOrder$));
    //console.log(this.getOrderByStatus(this.listOrder$))
    //console.log(this.getOrderNumberByStatus(this.getOrderByStatus(this.listOrder$)))

    //this._getOrderByStatus(this.listOrder$).subscribe(x => console.log(x));

    //this._getOrderByStatus(this.listOrder$).subscribe(x => this.showPieChart(x))

    //const obsof = of([1, 2, 5])
    // Működik
    //this.orderNumberByStatus_data$ = this.getOrderNumberByStatus(this.listOrder$)

    //this.newOrder_data$=this.getOrderNumberByStatus(this.listOrder$);


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
      this.showLastOrderIncome(observedIntevallum,lastIncome)
      this.showLastOrderCumulativeSum(observedIntevallum, cumulativeSum)

      // console.log(cumulativeSum)
      // console.log(lastIncome)



      var arr = [{
        id: 1,
        name: 'bill'
      }, {
        id: 2,
        name: 'ted'
      }]

      var result = arr.map(person => ({ value: person.id, text: person.name }));
      console.log(result)



      let lastFiveOrderArray = allOrderArray.slice(-5).reverse();
      const newTampe = {id:0, fullName: '', income: '', country: ''}

      let newObj = lastFiveOrderArray.map(x =>  ({
        id: x.id,
        fullName: `${x.customer?.firstName} ${x.customer?.lastName}`,
        income: x.amount * Number(x.product?.price),
        country: x.customer?.address.country
      })
      )

      console.log(newObj)

      this.lastFiveOrderArray = lastFiveOrderArray;
      console.log(lastFiveOrderArray);


      this.newOrder_data$ = newObj;
    })


  }
  //onInit -----------------------------------------------------------------------

  // Számértékek a Dashboard-ra
  orderNumberByStatus_data$: any;
  lastFiveOrderArray: any;


  newOrder_data$: any;
  shippedOrder_data: any;
  paidOrder_data: any;
  orderSum_data: any;





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




  // testValue: any;
  // innercategory: any;


  //----------------------------------------
  // Category
  selectedCategoryID: number = 2;
  selectedCategory$: Observable<Category> = this.categoryService.get(this.selectedCategoryID);
  onUpdateCategoryForm(cat?: any) {
    console.log(cat);
    this.selectedCategory$ = this.categoryService.get(cat)
  }

  onUpdateCategory(dataObject: Category): void {
    console.log(dataObject);
    this.categoryService.update(dataObject).subscribe();
  }



  //----------------------------------------
  // Cutomer
  selectedCustomerID: number = 6;
  selectedCustomer$: Observable<Customer> = this.customerService.get(this.selectedCustomerID);
  onUpdateCustomerForm(id?: any) {
    console.log(id);
    this.selectedCustomer$ = this.customerService.get(id)
  }
  onUpdateCustomer(customer: Customer): void {
    //console.log('customer: ', customer);
    //console.log('customer: ', `${typeof customer}`);

    this.customerService.update(customer).subscribe();
  }

  //----------------------------------------
  // Product
  selectedProductID: number = 4;
  selectedProduct$: Observable<Product> = this.productService.get(this.selectedProductID);
  onUpdateProductForm(id?: any) {
    //console.log(id);
    this.selectedProduct$ = this.productService.get(id)
  }

  onUpdateProduct(product: Product): void {
    // product.catID = product.catID * 1;
    // let newProduct = new Product();
    // newProduct = product;
    //delete newProduct.category;

    // const newProduct = new Product();
    // delete newProduct.category;
    // for (const key of Object.keys(newProduct)) {
    //   newProduct[key] = product[key];
    // }


    console.log('product: ', product);
    //console.log('newProduct: ', newProduct);;
    this.productService.update(product).subscribe();
  }

  onCreateProduct(product: Product): void {
    //product.catID = product.catID * 1; // A String-ből Number-t csinál.

    // Ki kell törölni a szükségetlen kulcsokat, hogy a szerverre az eredeti
    // adatszerkezet szerint menjenek az adatok.
    const newProduct = new Product();
    delete newProduct.category;
    for (const key of Object.keys(newProduct)) {
      newProduct[key] = product[key];
    }


    console.log('product: ', product);
    console.log('newProduct: ', newProduct);
    //this.productService.update(product).subscribe();
    //this.productService.createForce(newProduct).subscribe();
  }



  //----------------------------------------
  // Order
  selectedOrderID: number = 2;
  selectedOrder$: Observable<Order> = this.orderService.get(this.selectedOrderID);
  onUpdateOrderForm(id: number) {
    console.log(id);
    this.selectedOrder$ = this.orderService.get(id)
  }

  onUpdateOrder(order: Order): void {
    // console.log(order);
    // let newOrder = {
    //   id: 0,
    //   customerID: 0,
    //   productID: 0,
    //   amount: 0,
    //   status: '',
    // }

    // newOrder.id = order.id;
    // newOrder.customerID = order.customerID;
    // newOrder.productID = order.productID;
    // newOrder.amount = order.amount;
    // newOrder.status = order.status;



    console.log(order);
    this.orderService.update(order).subscribe();
  }

  onDeleteOrder(order: Order): void {
    //this.orderService.delete(order.id).subscribe();
  }

  onCreateOrder(order: Order): void {
    console.log(order);
  }


}
