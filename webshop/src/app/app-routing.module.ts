import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBillsComponent } from './page/edit-bills/edit-bills.component';
import { EditCategoriesComponent } from './page/edit-categories/edit-categories.component';
import { EditCustomersComponent } from './page/edit-customers/edit-customers.component';
import { EditOrdersComponent } from './page/edit-orders/edit-orders.component';
import { EditProductsComponent } from './page/edit-products/edit-products.component';
import { HomeComponent } from './page/home/home.component';
import { TestComponent } from './page/test/test.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'edit-categories',
    component: EditCategoriesComponent,
  },
  {
    path: 'edit-products',
    component: EditProductsComponent,
  },
  {
    path: 'edit-customers',
    component: EditCustomersComponent,
  },
  {
    path: 'edit-orders',
    component: EditOrdersComponent,
  },
  {
    path: 'edit-bills',
    component: EditBillsComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
