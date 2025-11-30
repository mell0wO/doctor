import { Routes } from '@angular/router';
import { PatientsComponent } from './patient/patients/patients.component';
import { CalendarComponent } from './calendar.directory/calendar/calendar.component';
import { FinanceComponent } from './finance/finance.component';
import { RecordComponent } from './patient/record/record.component';
import { HomeComponent } from './home/home.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'finance', component: FinanceComponent, canActivate: [AuthGuard] },
  { path: 'records', component: RecordComponent, canActivate: [AuthGuard] },

  { path: 'login', component: AuthentificationComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
