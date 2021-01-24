import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-no-results',
  template: `
      <ng-container *transloco="let t">
          <div class="no-results">
              <mat-divider></mat-divider>
              <div class="message">
                  <img src="../../../assets/images/no-data.jpg" width="200" alt="no-results-image">&nbsp;
                  <h2>{{t('no results message')}}</h2>
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
