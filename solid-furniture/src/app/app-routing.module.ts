import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './page/home/home.component';
import { TestComponent } from './page/test/test.component';
import { BillsComponent } from './page/bills/bills.component';
import { OrdersComponent } from './page/orders/orders.component';
import { CustomersComponent } from './page/customers/customers.component';
import { ProductsComponent } from './page/products/products.component';
import { EditProductsComponent } from './page/edit-products/edit-products.component';
import { EditCustomersComponent } from './page/edit-customers/edit-customers.component';
import { EditOrdersComponent } from './page/edit-orders/edit-orders.component';
import { EditBillsComponent } from './page/edit-bills/edit-bills.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'bills',
    component: BillsComponent,
  },
  {
    path: 'edit-products/:id',
    component: EditProductsComponent,
  },
  {
    path: 'edit-bills/:id',
    component: EditBillsComponent,
  },
  {
    path: 'edit-orders/:id',
    component: EditOrdersComponent,
  },
  {
    path: 'edit-customers/:id',
    component: EditCustomersComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routerComponents = [
  HomeComponent,
  ProductsComponent,
  CustomersComponent,
  OrdersComponent,
  BillsComponent,
  EditBillsComponent,
  EditProductsComponent,
  EditCustomersComponent,
  EditOrdersComponent,
];
