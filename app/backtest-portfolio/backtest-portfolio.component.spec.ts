import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktestPortfolioComponent } from './backtest-portfolio.component';

describe('BacktestPortfolioComponent', () => {
  let component: BacktestPortfolioComponent;
  let fixture: ComponentFixture<BacktestPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacktestPortfolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktestPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
