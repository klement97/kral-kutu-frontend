import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navigation',
  template: `
      <p>Landing page comes here</p>
      <a routerLink="/order">Go to order page</a>
  `,
  styles: [
      `
    `
  ]
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
