import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownComponent } from './drawdown.component';

describe('DrawdownComponent', () => {
  let component: DrawdownComponent;
  let fixture: ComponentFixture<DrawdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
