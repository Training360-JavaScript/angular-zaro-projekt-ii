export class Address {

  [key: string]: any;
  id?: number;
  zip: string  = '';
  country: string = '';
  city: string = '';
  street: string = '';
  notes?: string = '';

  constructor(options?: Address) {
    if (!options) return;
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }
  }

  show(...arg: string[]): any {
    if (arg.length != 0) {
      const result = arg.map(key => (this[key]) ? this[key] : '').join(', ')
      return result;
    }
    return this.full;
  }

  get full(): string {
    return [
      this.zip,
      this.country,
      this.city,
      this.street,
      this.notes,
    ].join(', ')
  }

}
