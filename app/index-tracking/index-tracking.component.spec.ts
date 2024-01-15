import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTrackingComponent } from './index-tracking.component';

describe('IndexTrackingComponent', () => {
  let component: IndexTrackingComponent;
  let fixture: ComponentFixture<IndexTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
