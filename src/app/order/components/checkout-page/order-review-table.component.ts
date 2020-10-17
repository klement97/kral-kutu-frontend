import { Component, Input, OnInit } from '@angular/core';
import { OrderUnit } from 'src/app/order/order.model';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-order-review-table',
  styles: [``],
  template: `
      <ng-container *transloco="let t">
          <ng-container *ngIf="orderUnits">
              <table mat-table [dataSource]="orderUnits"
                     class="mat-elevation-z3" style="width: 100%;">
                  <!-- Code Column -->
                  <ng-container matColumnDef="code">
                      <th mat-header-cell *matHeaderCellDef>{{t('code')}}</th>
                      <td mat-cell *matCellDef="let element">{{element | ifNotNull: 'product.properties.code'}}</td>
                      <td mat-footer-cell *matFooterCellDef colspan="5">{{t('total')}}</td>
                  </ng-container>

                  <!-- Width Column -->
                  <ng-container matColumnDef="width">
                      <th mat-header-cell *matHeaderCellDef>{{t('width')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.width' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Height Column -->
                  <ng-container matColumnDef="height">
                      <th mat-header-cell *matHeaderCellDef>{{t('height')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.height' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Length Column -->
                  <ng-container matColumnDef="length">
                      <th mat-header-cell *matHeaderCellDef>{{t('length')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.length' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Price Column -->
                  <ng-container matColumnDef="price">
                      <th mat-header-cell *matHeaderCellDef>{{t('price')}}</th>
                      <td mat-cell *matCellDef="let element"> {{element.product.price | number | prefix: '€'}} </td>
                  </ng-container>

                  <!-- Quantity Column -->
                  <ng-container matColumnDef="quantity">
                      <th mat-header-cell *matHeaderCellDef>{{t('quantity')}}</th>
                      <td mat-cell *matCellDef="let element"> {{element.quantity | number}} </td>
                      <td mat-footer-cell *matFooterCellDef>{{totalQuantity | number}}</td>
                  </ng-container>

                  <!-- Subtotal Column -->
                  <ng-container matColumnDef="subtotal">
                      <th mat-header-cell *matHeaderCellDef>{{t('sub total')}}</th>
                      <td mat-cell *matCellDef="let element">
                          {{(element.product.price * element.quantity) | number | prefix: '€'}}
                      </td>
                      <td mat-footer-cell *matFooterCellDef>{{totalPrice | number | prefix : '€'}}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  <tr mat-footer-row *matFooterRowDef="['code', 'quantity', 'subtotal']; sticky: true"></tr>
              </table>
          </ng-container>
      </ng-container>
  `
})
export class OrderReviewTableComponent implements OnInit {
  @Input() orderUnits: BehaviorSubject<OrderUnit[]>;
  totalPrice = 0;
  totalQuantity = 0;
  displayedColumns = ['code', 'width', 'height', 'length', 'price', 'quantity', 'subtotal'];


  constructor() { }


  ngOnInit(): void {
    this.calculateTotalQuantityAndPrice();
  }


  calculateTotalQuantityAndPrice(): void {
    this.orderUnits.subscribe(units => {
        this.totalPrice = 0;
        this.totalQuantity = 0;
        units.forEach(unit => {
          this.totalQuantity += Number(unit.quantity);
          this.totalPrice += Number(unit.product.price) * Number(unit.quantity);
        });
      }
    );
  }

}
