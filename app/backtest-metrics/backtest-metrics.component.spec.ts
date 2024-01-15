import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktestMetricsComponent } from './backtest-metrics.component';

describe('BacktestMetricsComponent', () => {
  let component: BacktestMetricsComponent;
  let fixture: ComponentFixture<BacktestMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacktestMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktestMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
