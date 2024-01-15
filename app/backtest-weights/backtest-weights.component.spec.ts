import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktestWeightsComponent } from './backtest-weights.component';

describe('BacktestWeightsComponent', () => {
  let component: BacktestWeightsComponent;
  let fixture: ComponentFixture<BacktestWeightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacktestWeightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktestWeightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
