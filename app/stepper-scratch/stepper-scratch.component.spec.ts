import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperScratchComponent } from './stepper-scratch.component';

describe('StepperScratchComponent', () => {
  let component: StepperScratchComponent;
  let fixture: ComponentFixture<StepperScratchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperScratchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperScratchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
