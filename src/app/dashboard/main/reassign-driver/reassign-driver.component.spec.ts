import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDriverComponent } from './reassign-driver.component';

describe('ReassignDriverComponent', () => {
  let component: ReassignDriverComponent;
  let fixture: ComponentFixture<ReassignDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
