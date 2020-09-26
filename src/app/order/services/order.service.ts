import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ORDER_URLS } from 'src/app/order/services/urls';
import { buildQueryString, cacheValue, getFromCache, IDNameModel } from 'src/app/common/const';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  localCache = {};
  orderFormValue = {};


  constructor(
    private http: HttpClient
  ) { }


  getProduct(product_id: number) {
    return this.http.get(`${ORDER_URLS.PRODUCT}${product_id}`);
  }


  getProducts(paginator, filter) {
    return this.http.get(`${ORDER_URLS.PRODUCT}${buildQueryString(paginator, null, filter)}`);
  }


  getProductCategories(): Observable<IDNameModel[]> {
    return this.http.get<IDNameModel[]>(ORDER_URLS.PRODUCT_CATEGORY);
  }


  getLeathers(): Observable<any[]> {
    const url = ORDER_URLS.LEATHER;
    const cached = getFromCache(this.localCache, url);
    if (cached) {
      return of(cached);
    }
    return this.http.get<any[]>(url).pipe(
      map((leathers) => {
        cacheValue(this.localCache, url, leathers);
        return leathers;
      })
    );
  }


  getLeatherSerials() {
    return this.http.get(ORDER_URLS.LEATHER_SERIAL);
  }


  createOrder(order) {
    return this.http.post(ORDER_URLS.ORDER, order);
  }
}
