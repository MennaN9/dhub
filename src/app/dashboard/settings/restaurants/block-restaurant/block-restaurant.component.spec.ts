import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockRestaurantComponent } from './block-restaurant.component';

describe('BlockRestaurantComponent', () => {
  let component: BlockRestaurantComponent;
  let fixture: ComponentFixture<BlockRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
