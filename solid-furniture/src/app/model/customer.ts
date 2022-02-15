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

/*
export class Customer {
  // Customer (id, firstName, lastName, email, address: Address, active)

  // {"id":1,"firstName":"Fernandina","lastName":"Garmanson","email":"fgarmanson0@parallels.com","address":"insert address here","active":true}

  [key: string]: any;
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  // address: Address = new Address();
  address: string = '';
  active: boolean = false;
}*/
