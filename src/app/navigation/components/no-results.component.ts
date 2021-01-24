import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-no-results',
  template: `
      <ng-container *transloco="let t">
          <div class="no-results">
              <mat-divider></mat-divider>
              <div class="message">
                  <mat-icon>info</mat-icon>&nbsp;
                  <p>{{t('no results message')}}</p>
              </div>
              <mat-divider></mat-divider>
          </div>
      </ng-container>
  `,
  styles: [`
      .no-results {
          color: #00a81c;
      }

      .no-results > mat-divider {
          background: #00a81c;
      }

      .no-results > div > p {
          /*override global style that gives 12px bottom margin to p tag*/
          margin: 0;
      }

      .message {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 15px 0;
      }
  `]
})
export class NoResultsComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
  }

}
