import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanagePasswordComponent } from './chanage-password.component';

describe('ChanagePasswordComponent', () => {
  let component: ChanagePasswordComponent;
  let fixture: ComponentFixture<ChanagePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanagePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
