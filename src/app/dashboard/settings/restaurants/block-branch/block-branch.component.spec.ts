import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockBranchComponent } from './block-branch.component';

describe('BlockBranchComponent', () => {
  let component: BlockBranchComponent;
  let fixture: ComponentFixture<BlockBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
