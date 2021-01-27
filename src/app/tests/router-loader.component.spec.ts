import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterLoaderComponent } from 'src/app/navigation/components/router-loader.component';

describe('RouterLoaderComponent', () => {
  let component: RouterLoaderComponent;
  let fixture: ComponentFixture<RouterLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
