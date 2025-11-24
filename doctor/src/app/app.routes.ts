import { Routes } from '@angular/router';
import { PatientsComponent } from './patient/patients/patients.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FinanceComponent } from './finance/finance.component';
import { RecordComponent } from './patient/record/record.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'finance', component: FinanceComponent },
  { path: 'records', component: RecordComponent },
  { path: '**', redirectTo: 'patients' }  // catch-all fallback
];
