import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { PatientCardComponent } from '../patient-card/patient-card.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PatientCardComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  patients = [
    {
      id: 11223344,
      name: 'Yasmin Mrabet',
      birthDate: '05/04/2002',
      lastVisit: '09/09/2025',
      phone: '99 888 777'
    },
    {
      id: 223344,
      name: 'Ghassen Ayari',
      birthDate: '31/08/2003',
      lastVisit: '05/09/2025',
      phone: '99 587 587'
    },
    {
      id: 334455,
      name: 'Rayen Ayari',
      birthDate: '07/06/2005',
      lastVisit: '02/09/2025',
      phone: '99 670 784'
    },
    {
      id: 445566,
      name: 'Yassin Bouguerra',
      birthDate: '17/03/2004',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 667788,
      name: 'Abir Blhassen',
      birthDate: '04/07/2003',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 778899,
      name: 'Aya Ben Atitallah',
      birthDate: '04/02/2003',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 889900,
      name: 'Tarek Bouadila',
      birthDate: '11/01/2004',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 9990011,
      name: 'Imed Zayet',
      birthDate: '17/04/2003',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 110022334,
      name: 'Youssef Dkhil',
      birthDate: '19/12/2006',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
  {
      id: 223344550,
      name: 'Rayen Sayedi',
      birthDate: '17/03/2004',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    },
    {
      id: 55667788,
      name: 'Ouzaier Khayati',
      birthDate: '20/05/2003',
      lastVisit: '08/09/2025',
      phone: '29 623 635'
    }
  ];

  // patients currently displayed (after search/filter)
  displayedPatients = [...this.patients];

  ngOnInit() {
    // sort alphabetically on init
    this.patients.sort((a, b) => a.name.localeCompare(b.name));
    this.displayedPatients = [...this.patients];
  }

  // SEARCH
  searchData(query: string) {
    query = query.toLowerCase().trim();
    this.displayedPatients = this.patients.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );
  }

  // SHOW PATIENT DATA
  showPatientData(patient: any) {
    console.log('Patient data:', patient);
  }
}
