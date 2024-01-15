import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfResultsComponent } from './ef-results.component';

describe('EfResultsComponent', () => {
  let component: EfResultsComponent;
  let fixture: ComponentFixture<EfResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
