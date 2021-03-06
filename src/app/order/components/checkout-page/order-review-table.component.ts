import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderUnit } from 'src/app/order/order.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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
                      <td mat-footer-cell *matFooterCellDef colspan="7"><b>{{t('total')}}</b></td>
                  </ng-container>

                  <!-- Inner Leather -->
                  <ng-container matColumnDef="inner_leather">
                      <th mat-header-cell *matHeaderCellDef>{{t('inner_leather')}}</th>
                      <td mat-cell *matCellDef="let element">{{element | ifNotNull: 'product.inner_leather.name'}}</td>
                  </ng-container>

                  <!-- Outer Leather -->
                  <ng-container matColumnDef="outer_leather">
                      <th mat-header-cell *matHeaderCellDef>{{t('outer_leather')}}</th>
                      <td mat-cell *matCellDef="let element">{{element | ifNotNull: 'product.outer_leather.name'}}</td>
                  </ng-container>

                  <!-- Width Column -->
                  <ng-container matColumnDef="width">
                      <th mat-header-cell *matHeaderCellDef>{{t('width')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.width' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Length Column -->
                  <ng-container matColumnDef="length">
                      <th mat-header-cell *matHeaderCellDef>{{t('length')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.length' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Height Column -->
                  <ng-container matColumnDef="height">
                      <th mat-header-cell *matHeaderCellDef>{{t('height')}}</th>
                      <td mat-cell
                          *matCellDef="let element">{{element | ifNotNull: 'product.properties.height' : '' : 'cm'}}</td>
                  </ng-container>

                  <!-- Price Column -->
                  <ng-container matColumnDef="price">
                      <th mat-header-cell *matHeaderCellDef>{{t('price')}}</th>
                      <td mat-cell *matCellDef="let element"> {{element.product.price | number | prefix: '$'}} </td>
                  </ng-container>

                  <!-- Quantity Column -->
                  <ng-container matColumnDef="quantity">
                      <th mat-header-cell *matHeaderCellDef>{{t('quantity')}}</th>
                      <td mat-cell *matCellDef="let element"> {{element.quantity | number}} </td>
                      <td mat-footer-cell *matFooterCellDef><b>{{totalQuantity | number}}</b></td>
                  </ng-container>

                  <!-- Subtotal Column -->
                  <ng-container matColumnDef="subtotal">
                      <th mat-header-cell *matHeaderCellDef>{{t('sub total')}}</th>
                      <td mat-cell *matCellDef="let element">
                          {{(element.product.price * element.quantity) | number | prefix: '$'}}
                      </td>
                      <td mat-footer-cell *matFooterCellDef><b>{{totalPrice | number | prefix: '$'}}</b></td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  <tr mat-footer-row *matFooterRowDef="['code', 'quantity', 'subtotal']; sticky: true"></tr>
              </table>
          </ng-container>
      </ng-container>
  `
})
export class OrderReviewTableComponent implements OnInit, OnDestroy {
  @Input() orderUnits: BehaviorSubject<OrderUnit[]>;
  uns$ = new Subject();
  totalPrice = 0;
  totalQuantity = 0;
  displayedColumns = [
    'code', 'inner_leather', 'outer_leather',
    'width', 'length', 'height', 'price',
    'quantity', 'subtotal'
  ];


  constructor() { }


  ngOnInit(): void {
    this.calculateTotalQuantityAndPrice();
  }


  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }


  calculateTotalQuantityAndPrice(): void {
    this.orderUnits
      .pipe(takeUntil(this.uns$))
      .subscribe(units => {
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
