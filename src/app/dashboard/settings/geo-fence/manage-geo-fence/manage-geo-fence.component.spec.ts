import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGeoFenceComponent } from './manage-geo-fence.component';

describe('ManageGeoFenceComponent', () => {
  let component: ManageGeoFenceComponent;
  let fixture: ComponentFixture<ManageGeoFenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGeoFenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGeoFenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
