import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDriverComponent } from './import-driver.component';

describe('ImportDriverComponent', () => {
  let component: ImportDriverComponent;
  let fixture: ComponentFixture<ImportDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
