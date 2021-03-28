import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeatherFormComponent } from 'src/app/order/components/product-page/leather-form.component';

describe('LeatherFormComponent', () => {
  let component: LeatherFormComponent;
  let fixture: ComponentFixture<LeatherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeatherFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeatherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
