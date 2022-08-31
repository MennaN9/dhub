import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBusinessRequestComponent } from './approve-business-request.component';

describe('ApproveBusinessRequestComponent', () => {
  let component: ApproveBusinessRequestComponent;
  let fixture: ComponentFixture<ApproveBusinessRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBusinessRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBusinessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
