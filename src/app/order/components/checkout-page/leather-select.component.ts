import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Leather, LeatherSerial } from 'src/app/order/order.model';


@Component({
  selector: 'app-leather-select',
  styles: [`
      .container {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-column-gap: 20px;
          grid-row-gap: 15px;
          width: 100%;
          margin: 0 auto;
      }

      .leather {
          height: 100px;
          cursor: pointer;
          border: 3px solid rgba(10, 21, 57, 0.7);
          border-radius: 8px;
          transition: all;
          transition-duration: .2s;
          transition-timing-function: linear;
      }

      .leather > img {
          border-radius: 4px;
      }

      .leather:hover {
          border: 4px solid rgba(27, 163, 30, 0.5);
          transform: scale(1.15);
      }

      a:focus {
          border: 4px solid rgba(27, 163, 30, 0.6);
          transform: scale(1.15);
      }

      .leather-code {
          position: absolute;
          height: 20px;
          width: 100%;
          bottom: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          height: 50px;
          padding: 7px;
      }

      .mat-card.sticky {
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: 0;
          z-index: 2;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <mat-card class="title sticky">
              <h3>{{t(data.identifier)}}</h3>
          </mat-card>
          <div style="height: 10px"></div>
          <mat-accordion>
              <mat-expansion-panel *ngFor="let leathersSerial of data.leathersSerials">
                  <mat-expansion-panel-header>
                      <mat-panel-title>{{leathersSerial.name}}</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="container">
                      <a class="leather image-wrapper mat-elevation-z2"
                         href="javascript: void(null);"
                         *ngFor="let leather of leathersSerial.leathers"
                         (click)="selectLeather(leather, leathersSerial)">
                          <img [src]="leather.image" [alt]="leather.image | imageAlt" width="150px">
                          <span class="leather-code">{{leather.code}}</span>
                      </a>
                  </div>
              </mat-expansion-panel>
          </mat-accordion>
      </ng-container>
  `,
})
export class LeatherSelectComponent implements OnInit, OnDestroy {
  selectedLeather: Leather;
  selectedLeatherSerial: LeatherSerial;


  constructor(
    private bottomSheetConfig: MatBottomSheetRef<LeatherSelectComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { leathersSerials: LeatherSerial[], identifier }
  ) { }


  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.dismiss();
  }


  selectLeather(leather: Leather, leatherSerial: LeatherSerial) {
    this.selectedLeather = leather;
    this.selectedLeatherSerial = leatherSerial;
    this.dismiss();
  }


  dismiss() {
    const result = {leather: this.selectedLeather, leatherSerial: this.selectedLeatherSerial};
    this.bottomSheetConfig.dismiss(result);
  }

}
