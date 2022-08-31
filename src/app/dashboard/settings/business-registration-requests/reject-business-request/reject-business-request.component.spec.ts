import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectBusinessRequestComponent } from './reject-business-request.component';

describe('RejectBusinessRequestComponent', () => {
  let component: RejectBusinessRequestComponent;
  let fixture: ComponentFixture<RejectBusinessRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectBusinessRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectBusinessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
