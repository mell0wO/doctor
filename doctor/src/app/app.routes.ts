import { Routes } from '@angular/router';
import { PatientsComponent } from './patient/patients/patients.component';
import { CalendarComponent } from './calendar.directory/calendar/calendar.component';
import { FinanceComponent } from './finance/finance.component';
import { RecordComponent } from './patient/record/record.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'finance', component: FinanceComponent },
  { path: 'records', component: RecordComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
