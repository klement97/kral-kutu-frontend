import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryContentComponent } from 'src/app/order/components/product-page/accessory-content.component';

describe('AccessoryContentComponent', () => {
  let component: AccessoryContentComponent;
  let fixture: ComponentFixture<AccessoryContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessoryContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
