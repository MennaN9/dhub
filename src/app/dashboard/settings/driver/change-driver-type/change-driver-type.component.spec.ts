import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDriverTypeComponent } from './change-driver-type.component';

describe('ChangeDriverTypeComponent', () => {
  let component: ChangeDriverTypeComponent;
  let fixture: ComponentFixture<ChangeDriverTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDriverTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDriverTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
