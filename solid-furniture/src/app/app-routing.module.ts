import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './page/home/home.component';
import { BillsComponent } from './page/bills/bills.component';
import { OrdersComponent } from './page/orders/orders.component';
import { CustomersComponent } from './page/customers/customers.component';
import { ProductsComponent } from './page/products/products.component';
import { EditBillsComponent } from './page/edit-bills/edit-bills.component';
import { EditProductsComponent } from './page/edit-products/edit-products.component';
import { EditCustomersComponent } from './page/edit-customers/edit-customers.component';
import { EditOrdersComponent } from './page/edit-orders/edit-orders.component';

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
    path: 'products/:id',
    component: EditProductsComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'customers/:id',
    component: EditCustomersComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'orders/:id',
    component: EditOrdersComponent,
  },
  {
    path: 'bills',
    component: BillsComponent,
  },
  {
    path: 'bills/:id',
    component: EditBillsComponent,
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
