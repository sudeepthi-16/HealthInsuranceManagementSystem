import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPolicyDialogComponent } from './renew-policy-dialog';

describe('RenewPolicyDialogComponent', () => {
  let component: RenewPolicyDialogComponent;
  let fixture: ComponentFixture<RenewPolicyDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewPolicyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewPolicyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
