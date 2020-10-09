import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-select-button',
  template: `
      <ng-container *transloco="let t">
          <div class="wrapper">
              <button mat-stroked-button>
                <span style="display: flex; align-items: center; justify-content: center;">
                    <mat-icon>check_circle_outline</mat-icon>&nbsp;{{t('select')}}
                </span>
              </button>
          </div>
      </ng-container>
  `,
  styles: [`
      button {
          background-color: white;
          border-color: rgba(0, 168, 28, 0.1) !important;
          color: rgba(0, 168, 28, 0.88);
          width: 100%;
          opacity: 0.8;
          transition: all .2s ease-in-out;
          z-index: 3;
      }

      button:hover {
          opacity: 1;
          border-color: rgba(0, 168, 28, 1) !important;
      }
  `]
})
export class SelectButtonComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
  }

}
