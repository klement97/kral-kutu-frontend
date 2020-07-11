import { environment } from 'src/environments/environment';


const API_HOST = environment.apiHost;
const PRODUCT = `${API_HOST}/product/`;
const PRODUCT_CATEGORY = `${API_HOST}/product-category/`;
const LEATHER = `${API_HOST}/leather/`;
const LEATHER_SERIAL = `${API_HOST}/leather-serial/`;
const ORDER = `${API_HOST}/order/`;

export const ORDER_URLS = {
  PRODUCT,
  PRODUCT_CATEGORY,
  LEATHER,
  LEATHER_SERIAL,
  ORDER,
};
