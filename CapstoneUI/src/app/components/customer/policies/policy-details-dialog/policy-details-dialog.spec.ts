import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDetailsDialogComponent } from './policy-details-dialog';

describe('PolicyDetailsDialogComponent', () => {
  let component: PolicyDetailsDialogComponent;
  let fixture: ComponentFixture<PolicyDetailsDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
