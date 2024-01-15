import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktestSidebarComponent } from './backtest-sidebar.component';

describe('BacktestSidebarComponent', () => {
  let component: BacktestSidebarComponent;
  let fixture: ComponentFixture<BacktestSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacktestSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktestSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
