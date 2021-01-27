import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductCategoryTabsComponent } from 'src/app/order/components/product-page/product-category-tabs.component';

describe('ProductCategoryTabsComponent', () => {
  let component: ProductCategoryTabsComponent;
  let fixture: ComponentFixture<ProductCategoryTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
