import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDNameModel } from 'src/app/common/const';


@Component({
  selector: 'app-product-category-tabs',
  styles: [``],
  template: `
      <ng-container *transloco="let t">
          <nav mat-tab-nav-bar color="primary">

              <!-- All categories tab -->
              <a mat-tab-link [active]="activeCategoryID === null"
                 (click)="tabChanged({id: null, name: ''})">{{t('all')}}</a>

              <!-- Specific categories tabs -->
              <a mat-tab-link *ngFor="let category of categories"
                 (click)="tabChanged(category)"
                 [active]="activeCategoryID === category.id">
                  {{category.name}}
              </a>
          </nav>
      </ng-container>
  `
})
export class ProductCategoryTabsComponent implements OnInit {
  activeCategoryID = null;

  @Input() categories: IDNameModel[];
  @Output() categoryChange = new EventEmitter<IDNameModel>();


  constructor() {
  }


  ngOnInit(): void {
  }


  tabChanged(category: IDNameModel) {
    this.activeCategoryID = category.id;
    this.categoryChange.emit(category);
  }

}
