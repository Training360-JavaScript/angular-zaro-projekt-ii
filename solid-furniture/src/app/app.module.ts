import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HomeComponent } from './page/home/home.component';
import { HeaderComponent } from './common/header/header.component';
import { EditCategoriesComponent } from './page/edit-categories/edit-categories.component';
import { EditProductsComponent } from './page/edit-products/edit-products.component';
import { EditCustomersComponent } from './page/edit-customers/edit-customers.component';
import { EditOrdersComponent } from './page/edit-orders/edit-orders.component';
import { EditBillsComponent } from './page/edit-bills/edit-bills.component';
import { TestComponent } from './page/test/test.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    HeaderComponent,
    EditCategoriesComponent,
    EditProductsComponent,
    EditCustomersComponent,
    EditOrdersComponent,
    EditBillsComponent,
    TestComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
