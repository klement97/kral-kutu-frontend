import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FIRST_CATEGORY_TO_FILTER, IDNameModel } from 'src/app/common/const';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product-category-tabs',
  styles: [``],
  template: `
      <ng-container *transloco="let t">
          <nav mat-tab-nav-bar color="primary">
              <a mat-tab-link *ngFor="let category of categories"
                 (click)="tabChanged(category)"
                 [active]="activeCategoryID == category.id">
                  {{t(category.name)}}
              </a>
          </nav>
      </ng-container>
  `
})
export class ProductCategoryTabsComponent implements OnInit {
  @Input() categories: IDNameModel[];
  activeCategoryID: number = FIRST_CATEGORY_TO_FILTER.id;


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.getInitialCategory();
  }


  getInitialCategory() {
    const category = +this.route.snapshot.queryParamMap.get('category');
    if (category) {
      this.activeCategoryID = category;
    }
  }


  tabChanged(category: IDNameModel) {
    this.activeCategoryID = category.id;
    this.router.navigate([''], {queryParams: {category: category.id}, replaceUrl: true}).then();
  }

}
