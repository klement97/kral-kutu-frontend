import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCheckoutPageComponent } from 'src/app/order/components/post-checkout-page.component';

describe('PostCheckoutPageComponent', () => {
  let component: PostCheckoutPageComponent;
  let fixture: ComponentFixture<PostCheckoutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCheckoutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
