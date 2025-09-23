import { Routes } from '@angular/router';
import { PatientsComponent } from './patient/patients/patients.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FinanceComponent } from './finance/finance.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full'  
    },
    {
        path: 'patients',
        component: PatientsComponent 
    },
        {
        path: 'calendar',
        component: CalendarComponent 
    },

    {
        path: 'finance',
        component: FinanceComponent 
    },
];