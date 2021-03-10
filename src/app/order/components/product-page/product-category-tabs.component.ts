import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  activeCategories,
  FIRST_CATEGORY_TO_FILTER,
  FIRST_SUB_CATEGORY_TO_FILTER,
  IDNameModel
} from 'src/app/common/const';
import { ProductCategory } from 'src/app/order/order.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-product-category-tabs',
  styles: [`
      .category {
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .menu-button {
          margin-left: 20px;
      }

      .custom-padding {
          padding: 0 0 0 24px;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <nav mat-tab-nav-bar disablePagination color="primary">
              <a mat-tab-link
                 class="custom-padding"
                 *ngFor="let category of categories"
                 (click)="categoryChanged(category, null)"
                 [active]="locals.category.id == category.id">
                  <span class="category">
                      <span>{{t(category.name)}}</span>
                      <button mat-icon-button
                              [matMenuTriggerFor]="menu"
                              class="menu-button"
                              (click)="$event.stopPropagation()">
                          <mat-icon>arrow_drop_down</mat-icon>
                      </button>
                  </span>
                  <mat-menu #menu="matMenu">
                      <ng-template matMenuContent>
                          <button mat-menu-item (click)="resetSubCategory(category)">{{t('all')}}</button>
                          <button *ngFor="let subC of category.sub_categories"
                                  mat-menu-item
                                  routerLinkActive="active"
                                  (click)="categoryChanged(category, subC)">{{subC.name}}</button>
                      </ng-template>
                  </mat-menu>
              </a>
          </nav>
      </ng-container>
  `
})
export class ProductCategoryTabsComponent implements OnInit, OnDestroy {
  @Input() categories: ProductCategory[] = [];
  locals = {
    category: FIRST_CATEGORY_TO_FILTER,
    sub_category: FIRST_SUB_CATEGORY_TO_FILTER
  };
  uns$ = new Subject();


  constructor() {
    this.watchCategories();
  }


  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }


  watchCategories() {
    activeCategories
      .pipe(takeUntil(this.uns$))
      .subscribe(categories => this.locals = categories);
  }


  categoryChanged(category: ProductCategory, sub_category: IDNameModel = null) {
    if (sub_category === null) {
      sub_category = FIRST_SUB_CATEGORY_TO_FILTER;
    }
    activeCategories.next({category, sub_category});
  }


  resetSubCategory(category: ProductCategory) {
    activeCategories.next({category, sub_category: FIRST_SUB_CATEGORY_TO_FILTER});
  }

}
