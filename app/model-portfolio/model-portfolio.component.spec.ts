import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPortfolioComponent } from './model-portfolio.component';

describe('ModelPortfolioComponent', () => {
  let component: ModelPortfolioComponent;
  let fixture: ComponentFixture<ModelPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelPortfolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
