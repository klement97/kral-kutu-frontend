import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryTabsComponent } from 'src/app/order/components/product-category-tabs.component';

describe('ProductCategoryTabsComponent', () => {
  let component: ProductCategoryTabsComponent;
  let fixture: ComponentFixture<ProductCategoryTabsComponent>;

  beforeEach(async(() => {
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