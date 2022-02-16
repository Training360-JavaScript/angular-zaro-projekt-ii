import { Address } from "./address";

export class Customer {

  [key: string]: any;
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  address: Address = new Address();
  //address: string = '';
  active: boolean = false;

  constructor(options?: Customer) {
    if (!options) return;
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }
  }

  show(...arg: string[]): any {
    if (arg.length != 0) {
      const result = arg.map(key => (this[key]) ? this[key] : '').join(' ')
      return result;
    }
    return this.full;
  }

  get full(): string {
    return [
      this.firstName,
      this.lastName,
      this.email,
      //this.address,
    ].join(', ')
  }

}
