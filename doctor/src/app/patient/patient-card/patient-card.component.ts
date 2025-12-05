import { Component, Input, Output, EventEmitter } from '@angular/core';

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
    profession: string;
    phone: string;
    address: string;
    // Keep existing fields if needed elsewhere
    birthDate?: string;
    lastVisit?: string;
  };

  @Output() select = new EventEmitter<any>(); 
  
  onClick(): void {
    // console.log('PatientCard clicked — emitting patient:', this.patient);
    this.select.emit(this.patient);
  }
}