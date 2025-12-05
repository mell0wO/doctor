import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppointmentService } from '../../../services/appointment.service';
import { FinanceService } from '../../../services/finance.service';
import { PatientCardComponent } from '../patient/patient-card/patient-card.component';
import { RecordComponent } from '../patient/record/record.component';
import { PatientsService } from '../../../services/patients.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    SidebarComponent,
    PatientCardComponent,
    RecordComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private appointmentService: AppointmentService,
    private financeService: FinanceService,
    private patientsService: PatientsService,
    private cdr: ChangeDetectorRef
  ) {}

  /* ======== FINANCE VARIABLES ========= */
  debit: number = 0;
  credit: number = 0;
  profit: number = 0;

  /* ======== CALENDAR VARIABLES ========= */
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  events: any[] = [];

  /* ======== PATIENT VARIABLES ========= */
  patients: any[] = [];
  displayedPatients: any[] = [];
  selectedPatient: any = null;
  isRecordPopupVisible: boolean = false;

  /** Patients with appointment today */
  todayPatientNames: string[] = [];

  ngOnInit(): void {
    this.loadTodayAppointments();
    this.loadFinanceData();
    this.loadPatients();
  }

  /* =================== APPOINTMENTS =================== */
  loadTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        const todays = data.filter(a => {
          const start = new Date(a.start);
          return (
            start.getFullYear() === today.getFullYear() &&
            start.getMonth() === today.getMonth() &&
            start.getDate() === today.getDate()
          );
        });

        this.events = todays.map(a => ({
          title: a.patient_name,
          start: new Date(a.start),
          end: new Date(a.end),
        }));

        // store today's patient names
        this.todayPatientNames = todays.map(a => a.patient_name);

        // filter patients if available
        this.filterPatientsWithTodayAppointments();
      },
      // error: (err) => console.error('Failed to load today appointments:', err)
    });
  }

  /* =================== FINANCE =================== */
  loadFinanceData() {
    this.financeService.getEntries().subscribe({
      next: (entries: any[]) => {
        const debitItems = entries.filter(e => e.entry_type === 'debit');
        const creditItems = entries.filter(e => e.entry_type === 'credit');

        this.debit = debitItems.reduce((sum, e) => sum + this.parseAmount(e.amount), 0);
        this.credit = creditItems.reduce((sum, e) => sum + this.parseAmount(e.amount), 0);
        this.profit = this.debit - this.credit;
      },
      // error: (err) => console.error('Failed to load finance data:', err)
    });
  }

  private parseAmount(amount: any): number {
    if (typeof amount === 'number') return amount;
    return parseFloat(amount.replace(/\s|DT/g, '').replace(',', '.')) || 0;
  }

  /* =================== PATIENTS =================== */
  loadPatients() {
    this.patientsService.list().subscribe({
      next: (data: any[]) => {
        this.patients = data || [];
        this.patients.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));

        // filter after loading
        this.filterPatientsWithTodayAppointments();
      },
      // error: (err) => console.error('Failed to load patients:', err)
    });
  }

  /** Apply filtering only when both lists are available */
  filterPatientsWithTodayAppointments() {
    if (this.patients.length === 0) return;

    if (this.todayPatientNames.length === 0) {
      this.displayedPatients = [...this.patients];
      return;
    }

    this.displayedPatients = this.patients.filter(p =>
      this.todayPatientNames.includes(p.name)
    );
  }

  /* =================== PATIENT POPUP =================== */
  showPatientData(patient: any) {
    if (!patient?.id) {
      this.selectedPatient = patient;
      this.isRecordPopupVisible = true;
      return;
    }

    this.patientsService.get(patient.id).subscribe({
      next: (full: any) => {
        this.selectedPatient = full;
        this.isRecordPopupVisible = true;
      },
      error: () => {
        // console.error('Failed to load patient details');
        this.selectedPatient = patient;
        this.isRecordPopupVisible = true;
      }
    });
  }

  handleSave(formData: FormData) {
    // console.log('🟢 SAVE EVENT FIRED!', formData);

    if (this.selectedPatient?.id) {
      this.patientsService.update(this.selectedPatient.id, formData).subscribe({
        next: () => {
          this.loadPatients();
          this.isRecordPopupVisible = false;
        },
        // error: (err) => console.error('❌ Update error:', err)
      });
    } else {
      this.patientsService.create(formData).subscribe({
        next: () => {
          this.loadPatients();
          this.isRecordPopupVisible = false;
        },
        // error: (err) => console.error('❌ Create error:', err)
      });
    }
  }

  handleCancel() {
    this.isRecordPopupVisible = false;
  }
}
