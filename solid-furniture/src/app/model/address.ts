export class Address {

  // Address (zip, country, city, street, notes)

  // Miért változik folyton az adatszerkezte a szerveren?
  // https://nettuts.hu/jms/hgtucdpt/address
  // feb. 8., 16:35-kori állapot:
  //{"zip":"MD-3730","country":"Moldova","city":"Străşeni","street":"Oriole","notes":"1. floor"}

  zip: string | null = '';
  country: string = '';
  city: string = '';
  street: string = '';
  notes: string = '';

}
