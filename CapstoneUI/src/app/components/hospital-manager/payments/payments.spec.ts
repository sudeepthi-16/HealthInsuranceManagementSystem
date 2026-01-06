import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPaymentsComponent } from './payments';

describe('HospitalPaymentsComponent', () => {
  let component: HospitalPaymentsComponent;
  let fixture: ComponentFixture<HospitalPaymentsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
