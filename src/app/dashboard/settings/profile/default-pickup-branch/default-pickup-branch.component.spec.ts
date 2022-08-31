import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPickupBranchComponent } from './default-pickup-branch.component';

describe('DefaultPickupBranchComponent', () => {
  let component: DefaultPickupBranchComponent;
  let fixture: ComponentFixture<DefaultPickupBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultPickupBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPickupBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
