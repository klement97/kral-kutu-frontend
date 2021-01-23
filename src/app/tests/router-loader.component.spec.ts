import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterLoaderComponent } from 'src/app/navigation/components/router-loader.component';

describe('RouterLoaderComponent', () => {
  let component: RouterLoaderComponent;
  let fixture: ComponentFixture<RouterLoaderComponent>;

  beforeEach(async(() => {
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
