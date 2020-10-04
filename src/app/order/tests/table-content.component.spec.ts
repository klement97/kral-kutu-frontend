import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContentComponent } from 'src/app/order/components/product-page/table-content.component';

describe('TableContentComponent', () => {
  let component: TableContentComponent;
  let fixture: ComponentFixture<TableContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
