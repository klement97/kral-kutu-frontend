export interface Order {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  products: any[];
  date_created: string;
  date_last_updated: string;
}


export interface OrderUnit {
  product: any;
  hash: number;
  quantity: number;
}


export interface Product {
  id: number;
  image: string;
  category: { id: number, name: string };
  price: string;
  properties: any;
}


export interface TableProduct extends Product {
  properties: {
    width: string;
    height: string;
    length: string;
    code: string;
    notes: string;
  };
}


export interface AccessoryProduct extends Product {
  properties: {
    code: string;
    notes: string;
  };
}


export interface Leather {
  id: number;
  code: string;
  image: string;
  serial: LeatherSerial;
}


export interface LeatherSerial {
  id: number;
  name: string;
  leathers?: Leather[];
}


export interface LeatherSelectResult {
  leather: Leather;
  leatherSerial: LeatherSerial;
}
