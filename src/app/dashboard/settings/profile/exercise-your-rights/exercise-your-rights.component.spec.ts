import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseYourRightsComponent } from './exercise-your-rights.component';

describe('ExerciseYourRightsComponent', () => {
  let component: ExerciseYourRightsComponent;
  let fixture: ComponentFixture<ExerciseYourRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseYourRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseYourRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
