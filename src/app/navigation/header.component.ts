import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  template: `
      <ng-container *transloco="let t">
          <!-- BEGIN TOOLBAR -->
          <mat-toolbar color="primary" style="height: 50px">
              <span>Kral Kutu</span>
              <span class="spacer"></span>

              <!-- BEGIN ACTIONS -->
              <div>
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon>shopping_cart</mat-icon>
                  </button>
              </div>
              <mat-menu #menu yPosition="below" xPosition="before" class="menu">
                  <ng-template matMenuContent>
                      <app-cart></app-cart>
                  </ng-template>
              </mat-menu>
              <!-- END ACTIONS -->

          </mat-toolbar>
          <!-- END TOOLBAR -->
      </ng-container>
  `,
  styles: [
      `
          .spacer {
              display: flex;
              flex: 1 1 auto;
          }

          .menu .mat-menu-panel {
              min-width: unset;
              max-width: 320px;
              width: 320px;
          }

    `
  ]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
