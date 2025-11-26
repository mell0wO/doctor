import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../../../services/patients.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PatientsService],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  searchTerm = '';
  records: any[] = [];
  form = { name: '' };

  constructor(private patientsService: PatientsService) {}

  ngOnInit() {
    this.patientsService.getPatients().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (err) => console.error('Failed to load patients:', err)
    });
  }

  filteredRecords() {
    return this.records.filter(r =>
      r.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectRecord(item: any) {
    this.form.name = item.name;
  }

  save() {
    if (this.form.name) this.confirm.emit(this.form.name);
  }

  cancelPopup() {
    this.cancel.emit();
  }
}
