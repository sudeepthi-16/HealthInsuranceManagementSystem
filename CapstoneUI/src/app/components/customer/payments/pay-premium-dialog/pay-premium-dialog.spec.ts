import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPremiumDialogComponent } from './pay-premium-dialog';

describe('PayPremiumDialogComponent', () => {
  let component: PayPremiumDialogComponent;
  let fixture: ComponentFixture<PayPremiumDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPremiumDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPremiumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
