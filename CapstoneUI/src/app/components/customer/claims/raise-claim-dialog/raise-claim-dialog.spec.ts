import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseClaimDialogComponent } from './raise-claim-dialog';

describe('RaiseClaimDialogComponent', () => {
  let component: RaiseClaimDialogComponent;
  let fixture: ComponentFixture<RaiseClaimDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiseClaimDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiseClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
