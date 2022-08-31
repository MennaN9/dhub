import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMatCheckboxComponent } from './dynamic-mat-checkbox.component';

describe('DynamicMatCheckboxComponent', () => {
  let component: DynamicMatCheckboxComponent;
  let fixture: ComponentFixture<DynamicMatCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicMatCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMatCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
