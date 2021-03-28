import { Component, OnInit } from '@angular/core';
import { Order } from '../../order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-invoice',
  styles: [`
      .invoice-box {
          min-height: 900px;
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          font-size: 16px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
          color: #555;
      }

      .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
      }

      .invoice-box table td {
          padding: 5px;
          vertical-align: top;
      }

      .invoice-box table tr td:nth-child(2) {
          text-align: right;
      }

      #align-right {
          text-align: right;
      }

      .invoice-box table tr.top table td {
          padding-bottom: 20px;
      }

      .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
      }

      .invoice-box table tr.information table td {
          padding-bottom: 40px;
      }

      .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
      }

      .invoice-box table tr.details td {
          padding-bottom: 20px;
      }

      .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
      }

      .invoice-box table tr.item.last td {
          border-bottom: none;
      }

      .invoice-box table tr.total td:nth-child(4) {
          border-top: 2px solid #eee;
          font-weight: bold;
      }

      @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
              width: 100%;
              display: block;
              text-align: center;
          }

          .invoice-box table tr.information table td {
              width: 100%;
              display: block;
              text-align: center;
          }
      }

      @media print {
          .invoice-box {
              margin: 0 auto;
              border: none;
              box-shadow: none;
          }

          .invoice-box table tr.heading td {
              border: none;
          }

          .invoice-box table tr.total td:nth-child(2) {
              border: none;
          }
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <ng-template #loading>
              <app-content-loader></app-content-loader>
          </ng-template>

          <div class="invoice-box" *ngIf="(order && leatherIdMap) else loading">
              <table cellpadding="0" cellspacing="0">
                  <tr class="top">
                      <td colspan="4">
                          <table>
                              <tr>
                                  <td class="title">
                                      <img src="../../../../assets/images/itg-logo.png" [alt]="'italgold invoice'"
                                           style="width:100%; max-width:300px;">
                                  </td>

                                  <td>
                                      {{t('invoice')}}: ITG-{{orderID}}<br>
                                      {{t('created')}}: {{order.date_created | date: 'd/M/yyyy H:mm'}}<br>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>

                  <tr class="information">
                      <td colspan="4">
                          <table>
                              <tr>
                                  <td>
                                      Italgold sh.p.k<br>
                                      1001 Rr. Abdi Toptani<br>
                                      Toptani Shopping Center, 5-th floor
                                  </td>

                                  <td>
                                      {{order.first_name.toLowerCase() | titlecase}} {{order.last_name.toLowerCase() | titlecase}}
                                      <br>
                                      {{order.phone}}
                                      <span *ngIf="order.email">{{order.email}}</span>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <br>

                  <tr class="heading">
                      <td>{{t('item')}}</td>
                      <td>{{t('quantity')}}</td>
                      <td id="align-right">{{t('price')}}</td>
                      <td id="align-right">{{t('sub total')}}</td>
                  </tr>

                  <tr class="item" *ngFor="let product of order.products">

                      <!-- Code and other properties -->
                      <td>
                          <span style="font-weight: bold">{{product.code.toUpperCase()}}<br></span>
                          <span>{{product.notes}}<br></span>
                          <span>{{product | dimensions}}<br></span>
                          <span *ngIf="product.inner_leather">
                              {{t('inner_leather')}}: {{leatherIdMap[product.inner_leather].name}}<br>
                          </span>
                          <span *ngIf="product.outer_leather">
                              {{t('outer_leather')}}: {{leatherIdMap[product.outer_leather].name}}
                          </span>
                      </td>


                      <td>{{product.quantity}}</td>
                      <td id="align-right">{{product.price | currency: 'USD' : 'symbol'}}</td>
                      <td id="align-right">{{(product.price * product.quantity) | currency: 'USD' : 'symbol'}}</td>
                  </tr>

                  <tr class="total">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td id="align-right">{{t('total')}}: {{totalPrice | currency: 'USD' : 'symbol'}}</td>
                  </tr>
              </table>
          </div>
      </ng-container>
  `
})
export class InvoiceComponent implements OnInit {
  orderID: number;
  order: Order = null;
  totalPrice = 0;
  isLoading = false;
  leatherIdMap = {};


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {
  }


  ngOnInit(): void {
    this.orderID = +this.route.snapshot.paramMap.get('order_id');
    this.getOrder();
    this.getLeathers();
  }


  getOrder() {
    this.isLoading = true;
    this.orderService.getOrder(this.orderID).subscribe(
      (order) => {
        this.order = order;
        this.calculateTotal(order.products);
        this.isLoading = false;
      }, () => this.isLoading = false
    );
  }


  getLeathers() {
    this.orderService.getLeathers().subscribe((leathers) => {
      for (const leather of leathers) {
        this.leatherIdMap[leather.id] = leather;
      }
    });
  }


  calculateTotal(products) {
    this.totalPrice = 0;
    for (const unit of products) {
      const price = parseFloat(unit.price);
      this.totalPrice += price;
    }
  }

}
