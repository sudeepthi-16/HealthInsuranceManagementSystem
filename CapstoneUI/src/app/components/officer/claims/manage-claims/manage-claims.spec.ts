import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClaimsComponent } from './manage-claims';

describe('ManageClaimsComponent', () => {
  let component: ManageClaimsComponent;
  let fixture: ComponentFixture<ManageClaimsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClaimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
