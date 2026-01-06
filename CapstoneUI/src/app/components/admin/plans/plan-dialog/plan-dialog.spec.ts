import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDialogComponent } from './plan-dialog';

describe('PlanDialogComponent', () => {
  let component: PlanDialogComponent;
  let fixture: ComponentFixture<PlanDialogComponent>; 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
