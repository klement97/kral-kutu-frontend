import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckoutButtonComponent } from 'src/app/order/components/product-page/checkout-button.component';

describe('CheckoutButtonComponent', () => {
  let component: CheckoutButtonComponent;
  let fixture: ComponentFixture<CheckoutButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
