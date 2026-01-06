import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerClaimDetailsDialogComponent } from './claim-details-dialog';

describe('CustomerClaimDetailsDialogComponent', () => {
  let component: CustomerClaimDetailsDialogComponent;
  let fixture: ComponentFixture<CustomerClaimDetailsDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerClaimDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerClaimDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
