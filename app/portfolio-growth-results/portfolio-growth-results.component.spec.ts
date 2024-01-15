import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioGrowthResultsComponent } from './portfolio-growth-results.component';

describe('PortfolioGrowthResultsComponent', () => {
  let component: PortfolioGrowthResultsComponent;
  let fixture: ComponentFixture<PortfolioGrowthResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioGrowthResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioGrowthResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
