import { Category } from "./category";

export class Product {
  [key: string]: any;
  id: number = 0;
  name: string = '';
  type: string = '';
  catID: number = 0;
  description: string = '';
  price: number = 0;
  featured: boolean = false;
  active: boolean = false;

  category?: Category = new Category;

  constructor(options?: Product) {
    if (!options) return;
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }
  }

}
