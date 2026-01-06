import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalLayoutComponent } from './hospital-layout';

describe('HospitalLayoutComponent', () => {
  let component: HospitalLayoutComponent;
  let fixture: ComponentFixture<HospitalLayoutComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
