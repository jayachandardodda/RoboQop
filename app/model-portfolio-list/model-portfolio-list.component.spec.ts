import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPortfolioListComponent } from './model-portfolio-list.component';

describe('ModelPortfolioListComponent', () => {
  let component: ModelPortfolioListComponent;
  let fixture: ComponentFixture<ModelPortfolioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelPortfolioListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPortfolioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
