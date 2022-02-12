export class Bill {
  // Bill (id, orderID, amount, status: new|paid)

  // https://nettuts.hu/jms/hgtucdpt/bill
  // feb. 8., 16:43-kori állapot:
  // {"id":1,"orderID":1,"amount":56,"status":"new"}

  [key: string]: any;
  id: number = 0;
  orderID: number = 0;
  amount: number = 0;
  // status: string = 'new' || 'paid';
  status: string = '';
}
