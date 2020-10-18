import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeatherSelectComponent } from 'src/app/order/components/checkout-page/leather-select.component';

describe('LeatherSelectComponent', () => {
  let component: LeatherSelectComponent;
  let fixture: ComponentFixture<LeatherSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeatherSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeatherSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
