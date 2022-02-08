import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HomeComponent } from './page/home/home.component';
import { HeaderComponent } from './common/header/header.component';
import { EditProductsComponent } from './page/edit-products/edit-products.component';
import { EditCustomersComponent } from './page/edit-customers/edit-customers.component';
import { EditOrdersComponent } from './page/edit-orders/edit-orders.component';
import { EditBillsComponent } from './page/edit-bills/edit-bills.component';
import { TestComponent } from './page/test/test.component';
import { BillsComponent } from './page/bills/bills.component';
import { OrdersComponent } from './page/orders/orders.component';
import { CustomersComponent } from './page/customers/customers.component';
import { ProductsComponent } from './page/products/products.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http"

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    HeaderComponent,
    EditProductsComponent,
    EditCustomersComponent,
    EditOrdersComponent,
    EditBillsComponent,
    TestComponent,
    BillsComponent,
    OrdersComponent,
    CustomersComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
