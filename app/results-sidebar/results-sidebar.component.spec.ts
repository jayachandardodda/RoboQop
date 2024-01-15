import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSidebarComponent } from './results-sidebar.component';

describe('ResultsSidebarComponent', () => {
  let component: ResultsSidebarComponent;
  let fixture: ComponentFixture<ResultsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
