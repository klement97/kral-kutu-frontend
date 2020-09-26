export interface Order {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  order_units: any;
}


export interface Product {
  id: number;
  code: string;
  title: string;
  description: string;
  image: string;
  category: any;
  inner_leather: any;
  outer_leather: any;
  price: string;
  height: string;
  width: string;
  length: string;
}
