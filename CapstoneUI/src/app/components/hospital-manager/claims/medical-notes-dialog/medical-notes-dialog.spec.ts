import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalNotesDialogComponent } from './medical-notes-dialog';

describe('MedicalNotesDialogComponent', () => {
  let component: MedicalNotesDialogComponent;
  let fixture: ComponentFixture<MedicalNotesDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalNotesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalNotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
