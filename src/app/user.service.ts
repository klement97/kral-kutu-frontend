import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  ipLookUp(): Observable<any> {
    if (environment.production) {
      return this.http.get('http://ip-api.com/json');
    }
    return of({});
  }
}
