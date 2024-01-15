import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktestDrawdownComponent } from './backtest-drawdown.component';

describe('BacktestDrawdownComponent', () => {
  let component: BacktestDrawdownComponent;
  let fixture: ComponentFixture<BacktestDrawdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacktestDrawdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktestDrawdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
