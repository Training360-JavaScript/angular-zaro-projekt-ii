import { Customer } from "./customer";
import { Product } from "./product";

export class Order {
  [key: string]: any;
  id: number = 0;
  customerID: number = 0;
  productID: number = 0;
  amount: number = 0;
  status: string = '';

  customer?: Customer = new Customer();
  product?: Product = new Product();
}
