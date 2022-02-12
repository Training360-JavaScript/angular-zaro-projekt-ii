export class Product {
  // Product (id, name, type, catID, description, price, featured, active)

  // https://nettuts.hu/jms/hgtucdpt/product
  // feb. 8., 16:49-kori állapot:
  // {"id":1,"name":"Ciprofide","type":"Rally Wagon 2500","catID":3,"description":"Loremntiy.","price":938,"featured":false,"active":false}

  [key: string]: any;
  id: number = 0;
  name: string = '';
  type: string = '';
  catID: number = 0;
  description: string = '';
  price: number = 0;
  featured: boolean = false;
  active: boolean = false;
}
