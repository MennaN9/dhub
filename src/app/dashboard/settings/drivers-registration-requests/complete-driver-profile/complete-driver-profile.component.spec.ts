import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDriverProfileComponent } from './complete-driver-profile.component';

describe('CompleteDriverProfileComponent', () => {
  let component: CompleteDriverProfileComponent;
  let fixture: ComponentFixture<CompleteDriverProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteDriverProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteDriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
