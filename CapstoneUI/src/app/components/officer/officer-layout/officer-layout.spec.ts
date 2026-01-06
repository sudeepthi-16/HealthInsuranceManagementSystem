import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerLayoutComponent } from './officer-layout';

describe('OfficerLayoutComponent', () => {
  let component: OfficerLayoutComponent;
  let fixture: ComponentFixture<OfficerLayoutComponent>;  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
