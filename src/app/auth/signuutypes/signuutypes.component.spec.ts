import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignuutypesComponent } from './signuutypes.component';

describe('SignuutypesComponent', () => {
  let component: SignuutypesComponent;
  let fixture: ComponentFixture<SignuutypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignuutypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignuutypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
