import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-router-loader',
  template: `
      <div style="height: 10px">
          <mat-progress-bar *ngIf="isLoading" color="accent" mode="indeterminate"></mat-progress-bar>
      </div>
  `,
  styles: []
})
export class RouterLoaderComponent implements OnInit {
  isLoading = false;


  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.watchRouter();
  }


  watchRouter() {
    this.router.events.pipe(
      filter((event) =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )).subscribe((event) => {
      this.isLoading = event instanceof NavigationStart;
    });
  }

}
