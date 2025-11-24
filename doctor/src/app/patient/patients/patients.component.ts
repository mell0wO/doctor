import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { PatientCardComponent } from '../patient-card/patient-card.component';
import { RecordComponent } from '../record/record.component';
import { PatientsService } from '../../../../services/patients.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PatientCardComponent, RecordComponent, HttpClientModule],
  providers: [PatientsService],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  displayedPatients: any[] = [];
  isRecordPopupVisible = false;
  selectedPatient: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private patientsService: PatientsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId))  {
      this.patientsService.list().subscribe({
        next: (data: any[]) => {
          this.patients = Array.isArray(data) ? data : [];
          this.patients.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
          this.displayedPatients = [...this.patients];
        },
        error: (err: unknown) => {
          console.error('Failed to load patients', err);
          this.patients = [];
          this.displayedPatients = [];
        }
      });
    }
  }

  searchData(query: string) {
    const q = (query || '').toLowerCase().trim();
    this.displayedPatients = q
      ? this.patients.filter(p =>
          (p?.name || '').toLowerCase().includes(q) ||
          (p?.phone || '').includes(q)
        )
      : [...this.patients];
  }

  addPatient(): void {
    this.selectedPatient = null;
    this.isRecordPopupVisible = true;
  }

  closeRecordPopup(): void {
    this.isRecordPopupVisible = false;
    this.selectedPatient = null;
    this.cdr.detectChanges();
  }
  
  // In patients.component.ts - FIXED handleSave method
  handleSave(formData: FormData) {
    console.log('🟢 SAVE EVENT FIRED!', formData);

    // If patient has an ID → update
    if (this.selectedPatient?.id) {
      const patientId = this.selectedPatient.id;
      console.log('Updating patient ID:', patientId);
      
      this.patientsService.update(patientId, formData).subscribe({
        next: (response) => {
          console.log('✅ Updated successfully', response);
          this.refreshPatientsList();
          this.closeRecordPopup();
        },
        error: (err) => {
          console.error('❌ Update error:', err);
          // Add user-friendly error message here
        }
      });
    }
    // Otherwise → create
    else {
      console.log('Creating new patient');
      
      this.patientsService.create(formData).subscribe({
        next: (response) => {
          console.log('✅ Created successfully', response);
          this.refreshPatientsList();
          this.closeRecordPopup();
        },
        error: (err) => {
          console.error('❌ Create error:', err);
          // Add user-friendly error message here
        }
      });
    }
  }
  
  refreshPatientsList() {
    this.patientsService.list().subscribe(p => {
      this.patients = p;
      this.patients.sort((a, b) => (a?.name || '').localeCompare(b?.name || '')); // ← Add sort
      this.displayedPatients = [...this.patients];
      this.cdr.detectChanges(); // ← And change detection
    });
  }

  handleCancel() {
    this.closeRecordPopup();
  }

  showPatientData(patient: any) {
  // fetch full record (so profession / healthStatus and other fields are available)
  console.log('showPatientData: fetching full record for id', patient?.id);
  
  if (!patient?.id) {
      this.selectedPatient = patient;
      this.isRecordPopupVisible = true;
      console.log('Showing popup (no id):', this.selectedPatient, 'isRecordPopupVisible=', this.isRecordPopupVisible);
+     this.cdr.detectChanges();
      return;
  }

  this.patientsService.get(patient.id).subscribe({
      next: (full: any) => {
        console.log('loaded full patient', full);
        this.selectedPatient = full || patient;
        this.isRecordPopupVisible = true;
        console.log('After load — selectedPatient:', this.selectedPatient, 'isRecordPopupVisible:', this.isRecordPopupVisible);
+       this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load patient details', err);
        this.selectedPatient = patient;
        this.isRecordPopupVisible = true;
+       this.cdr.detectChanges();
      }
  });
  }
}
