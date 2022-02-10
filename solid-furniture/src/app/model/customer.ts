import { Address } from "./address";
export class Customer {
  [key: string]: any;
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  // address: Address = new Address();
  address: string = '';
  active: boolean = false;
}
