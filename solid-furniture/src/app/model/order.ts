export class Order {
  // Order (id, customerID, productID, amount, status: new|shipped|paid)

  // https://nettuts.hu/jms/hgtucdpt/order
  // feb. 8., 16:52-kori állapot:
  // {"id":1,"customerID":1,"productID":1,"amount":65,"status":"new"}

  [key: string]: any;
  id: number = 0;
  customerID: number = 0;
  productID: number = 0;
  amount: number = 0;
  //new || shipped || paid
  status: string = '';
}
