import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPoliciesComponent } from './customer-policies';

describe('CustomerPoliciesComponent', () => {
  let component: CustomerPoliciesComponent;
  let fixture: ComponentFixture<CustomerPoliciesComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
