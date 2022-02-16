import { BillService } from './../../service/bill.service';
import { CategoryService } from './../../service/category.service';
import { CustomerService } from './../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-test',
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

  listCategory$: Observable<Category[]> = this.categoryService.getAll();
  oneCategory$: Observable<Category> = this.categoryService.get(2);

  listAddress$: Observable<Address[]> = this.addressService.getAll();
  oneAddress$: Observable<Address> = this.addressService.get(5);

  listProduct$: Observable<Product[]> = this.productService.getAll();
  oneProduct$: Observable<Product> = this.productService.get(2);

  listCustomer$: Observable<Customer[]> = this.customerService.getAll();
  oneCustomer$: Observable<Customer> = this.customerService.get(1);

  listOrder$: Observable<Order[]> = this.orderService.getAll();
  oneOrder$: Observable<Order> = this.orderService.get(1);

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
    this.oneOrder$.subscribe(
      x => console.log(x)
    )

    this.oneProduct$.subscribe(
      x => {
        console.log(x);
       //this.valtozo = x.category?.name;
      }
    )

    this.oneProduct$.subscribe(x => {
      this.newProduct = x;
      this.setFormGroup();
    })

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
  selectedProductID: number = 2;
  selectedProduct$: Observable<Product> = this.productService.get(this.selectedProductID);
  onUpdateProductForm(id?: any) {
    console.log(id);
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

