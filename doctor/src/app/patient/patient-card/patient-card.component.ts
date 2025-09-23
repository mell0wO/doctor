import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.css']
})
export class PatientCardComponent {
  @Input() patient!: {
    id: number;
    name: string;
    birthDate: string;
    lastVisit: string;
    phone: string;
  };
}
