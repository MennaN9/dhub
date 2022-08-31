import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadaBrachesComponent } from './armada-braches.component';

describe('ArmadaBrachesComponent', () => {
  let component: ArmadaBrachesComponent;
  let fixture: ComponentFixture<ArmadaBrachesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmadaBrachesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmadaBrachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
