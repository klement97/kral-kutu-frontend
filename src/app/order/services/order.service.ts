import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ORDER_URLS } from 'src/app/order/services/urls';
import { buildQueryString } from 'src/app/common/const';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getProduct(product_id: number) {
    return this.http.get(`${ORDER_URLS.PRODUCT}${product_id}`);
  }

  getProducts(paginator, filter) {
    return this.http.get('/assets/fixtures/products.json');
    // return this.http.get(`${ORDER_URLS.PRODUCT}${buildQueryString(paginator, null, filter)}`);
  }

  getProductCategories() {
    return this.http.get(ORDER_URLS.PRODUCT_CATEGORY);
  }

  getLeathers() {
    return this.http.get(ORDER_URLS.LEATHER);
  }

  getLeatherSerials() {
    return this.http.get(ORDER_URLS.LEATHER_SERIAL);
  }

  createOrder(order) {
    return this.http.post(ORDER_URLS.ORDER, order);
  }
}
