import {Component, OnInit} from '@angular/core';
import {OrderService} from 'src/app/order/services/order.service';
import {ActivatedRoute} from '@angular/router';
import {Order} from 'src/app/order/order.model';


@Component({
  selector: 'app-post-checkout-page',
  styles: [`
    .center {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .row {
      display: flex;
      justify-content: space-between;
    }

    .container {
      flex-direction: column;
      padding: 20px;
    }

    .std-width {
      width: 90%;
    }

    .alert-success {
      margin: 20px;
      color: #3c763d;
      background-color: #dff0d8;
      border-color: #d6e9c6;
    }

    @media print {
      #alert-card {
        display: none;
      }

      .std-width {
        width: 100%;
      }

      .mat-card, .container {
        display: block;
        padding: 0;
      }
    }
  `],
  template: `
    <ng-container *transloco="let t">
      <div class="container center">

        <!-- Success Alert -->
        <mat-card class="alert-success std-width" id="alert-card">
          <span class="row">
            <span class="center">
                <mat-icon>check</mat-icon>&nbsp;
              {{t('order success message')}}
            </span>
            <button mat-icon-button (click)="print()">
            <span class="center">
                <mat-icon>print</mat-icon>&nbsp;Print
            </span>
          </button>
          </span>
        </mat-card>

        <mat-card class="invoice std-width">
          <app-invoice></app-invoice>
        </mat-card>
      </div>
    </ng-container>
  `
})
export class PostCheckoutPageComponent implements OnInit {
  constructor() {
  }


  ngOnInit(): void {
  }

  print() {
    window.print();
  }

}
