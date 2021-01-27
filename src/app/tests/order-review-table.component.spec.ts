import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderReviewTableComponent } from 'src/app/order/components/checkout-page/order-review-table.component';

describe('OrderReviewTableComponent', () => {
  let component: OrderReviewTableComponent;
  let fixture: ComponentFixture<OrderReviewTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReviewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
