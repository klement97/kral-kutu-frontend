import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-no-results',
  template: `
      <ng-container *transloco="let t">
          <p>{{t('no results')}}</p>
      </ng-container>
  `,
  styles: []
})
export class NoResultsComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
  }

}
