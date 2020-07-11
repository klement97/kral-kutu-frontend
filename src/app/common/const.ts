import { formatDate } from '@angular/common';
import { Paginator } from 'primeng/paginator';


export const MIN_TIME = '00:00:00.000000';
export const MAX_TIME = '23:59:59.999999';


export function buildQueryString(paginator: Paginator = null, sort = null, filter: any): string {
  const queryString = [];
  const page_size: number = paginator?.rows ? paginator.rows : 10;
  let page: number = paginator?.getPage() ? paginator.getPage() : 0;
  page++;  // mat-paginator starts indexing from zero

  if (page) {
    queryString.push(`page=${page}`);
  }
  if (page_size) {
    queryString.push(`page_size=${page_size}`);
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
