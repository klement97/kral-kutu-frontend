import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ORDER_URLS } from 'src/app/order/services/urls';
import { buildQueryString, cacheValue, getFromCache } from 'src/app/common/const';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Leather, LeatherSerial, Order, Product, ProductCategory } from 'src/app/order/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  localCache = {};
  orderFormValue = {};


  constructor(
    private http: HttpClient
  ) { }


  getProducts(paginator, filter): Observable<{ count: number, results: Product[] }> {
    return this.http.get<{ count: number, results: Product[] }>(
      `${ORDER_URLS.PRODUCT}${buildQueryString(paginator, null, filter)}`
    );
  }


  getProductsByCode(paginator, filter): Observable<{ count: number, results: Product[] }> {
    return this.http.get<{ count: number, results: Product[] }>(`${ORDER_URLS.PRODUCT}${buildQueryString(paginator, null, filter)}`);
  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(ORDER_URLS.PRODUCT_CATEGORY);
  }


  getLeathers(): Observable<Leather[]> {
    const url = ORDER_URLS.LEATHER;
    const cached = getFromCache(this.localCache, url);
    if (cached) {
      return of(cached);
    }
    return this.http.get<Leather[]>(url).pipe(
      map((leathers) => {
        cacheValue(this.localCache, url, leathers);
        return leathers;
      })
    );
  }


  getLeatherSerials(): Observable<LeatherSerial[]> {
    return this.http.get<LeatherSerial[]>(ORDER_URLS.LEATHER_SERIAL);
  }


  createOrder(order) {
    return this.http.post<null>(ORDER_URLS.ORDER, order);
  }


  getOrder(id: number) {
    return this.http.get<Order>(`${ORDER_URLS.ORDER}${id}/`);
  }
}
