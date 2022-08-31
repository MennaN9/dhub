import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticOrManualAssignComponent } from './automatic-or-manual-assign.component';

describe('AutomaticOrManualAssignComponent', () => {
  let component: AutomaticOrManualAssignComponent;
  let fixture: ComponentFixture<AutomaticOrManualAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomaticOrManualAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticOrManualAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
