import { formatDate } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/order/order.model';


export const productsInCart = new BehaviorSubject([]);

export const positiveIntegerRegex = new RegExp('^[1-9]\\d*$');
export const positiveIntegerWithZeroRegex = new RegExp('^\\d+$');

export const PRODUCTS_IN_CART = 'kralKutuCartProducts';
export const MIN_TIME = '00:00:00.000000';
export const MAX_TIME = '23:59:59.999999';

export const FIRST_CATEGORY_TO_FILTER = {id: 5, name: 'Accessory'};


export interface IDNameModel {
  id: number;
  name: string;
}


export function buildQueryString(paginator: MatPaginator = null, sort = null, filter: any): string {
  const queryString = [];
  const pageSize: number = paginator?.pageSize ? paginator.pageSize : 10;
  let page: number = paginator?.pageIndex ? paginator?.pageIndex : 0;
  page++;  // mat-paginator starts indexing from zero

  if (page) {
    queryString.push(`page=${page}`);
  }
  if (pageSize) {
    queryString.push(`page_size=${pageSize}`);
  }
  if (sort) {
    const ordering = sort ? getSort(sort.active, sort.direction) : '-id';
    queryString.push(`ordering=${ordering}`);
  }
  if (filter) {
    queryString.push(buildFilterString(filter));
  }
  if (queryString.length > 0) {
    return '?' + queryString.join('&');
  }
  return '';
}


function buildFilterString(_filter: { [key: string]: any }) {
  const filter = {..._filter};
  let filterString = '';
  Object.keys(filter).forEach((key) => {
    let value = filter[key];
    if (value) {
      if (value instanceof Date) {
        value = reformatDate(key, value);
      }
      filterString += `${key}=${value}&`;
    }
  });
  return filterString;
}


function reformatDate(field_name: string, date: Date): string {
  if (field_name.includes('_before')) {
    return formatDateToString(date, MAX_TIME);
  } else if (field_name.includes('_after')) {
    return formatDateToString(date, MIN_TIME);
  } else {
    return formatDateToString(date);
  }
}


export function formatDateToString(date: Date | string, time: string = ''): string {
  if (typeof date === 'object') {
    let formattedDate: string = formatDate(date, 'yyyy-MM-dd', 'en-us');
    if (time) {
      formattedDate += `+${time}`;
    }
    return formattedDate;
  }
  return date;
}


/**
 * Convert Mat Sort Header Direction to required sign for backend.
 * @param active:         Field name
 * @param direction:      Mat Sort Direction
 * @return sort:          '-' if directions is desc and '' otherwise
 */
export function getSort(active: string, direction: 'asc' | 'desc' | '') {
  const sort = direction === 'desc' ? '-' : '';
  return sort + active;
}


export function composeOrderUnit(product, quantity, hash) {
  return {product: {...product}, quantity, hash};
}


export function setProductsInCart(products: BehaviorSubject<any[]>, newProducts: any[]) {
  products.next(newProducts);
  localStorage.setItem(PRODUCTS_IN_CART, JSON.stringify(newProducts));
}


export function clearCart() {
  productsInCart.next([]);
  localStorage.setItem(PRODUCTS_IN_CART, JSON.stringify([]));
}


/**
 * Creates a hash by taking a string and using a shift based algorithm.
 * @param value   String that will be hashed.
 */
export function hashCode(value: string) {
  let hash = 0;
  let i;
  let chr;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // tslint:disable-next-line:no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}


export function hashCodeFromProduct(product: Product, fields: string[] = ['code', 'width', 'height', 'length']) {
  let productString = product.category.name.toLowerCase();
  for (const field of fields) {
    if (typeof product.properties[field] !== 'undefined') {
      productString += `&${product.properties[field]}`;
    }
  }

  return hashCode(productString);
}


export function cacheValue(cache, key, value) {
  cache[key] = value;
}


export function getFromCache(cache, key) {
  return cache[key];
}


export function fromEntries<T>(entries: [keyof T, T[keyof T]][]): T {
  return entries.reduce((acc, [key, value]) => ({...acc, [key]: value}), {} as T);
}
