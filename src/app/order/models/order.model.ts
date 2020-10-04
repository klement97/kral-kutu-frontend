export interface Order {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  products: any[];
}


export interface Product {
  id: number;
  code: string;
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
    code: string
  };
}


export interface AccessoryProduct extends Product {
  properties: {
    code: string
  };
}
