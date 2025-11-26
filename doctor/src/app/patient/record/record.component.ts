import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, FormsModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnChanges {

  @Input() title: string | null = null;
  @Input() link: string = ''; 
  @Input() patient: any = null;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: any = {};

  selectedFiles: File[] = [];
  isDragOver: boolean = false;

  documents: any[] = [];

  deletedDocuments: number[] = [];


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient']) {
      const p = changes['patient'].currentValue;

      this.form = p ? {
        id: p.id,
        name: p.name || '',
        phone: p.phone || '',
        profession: p.profession || '',
        address: p.address || '',
        healthStatus: p.etatdesante || ''
      } : {};

      this.documents = p?.documents || [];
      this.cdr.detectChanges();
    }
  }

  /* ----------  FILE INPUT ---------- */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.push(...Array.from(input.files));
      input.value = '';
      this.cdr.detectChanges();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      this.selectedFiles.push(...Array.from(event.dataTransfer.files));
      this.cdr.detectChanges();
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.cdr.detectChanges();
  }

  /* ---------- VIEW ---------- */

  viewFile(file: File): void {
    window.open(URL.createObjectURL(file), '_blank');
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }

  getFileIcon(ext?: string): string {
    if (!ext) return 'bi bi-file-earmark';
    const map: any = {
      pdf: 'bi bi-file-earmark-pdf',
      jpg: 'bi bi-file-earmark-image',
      jpeg: 'bi bi-file-earmark-image',
      png: 'bi bi-file-earmark-image',
      zip: 'bi bi-file-earmark-zip',
      rar: 'bi bi-file-earmark-zip',
      txt: 'bi bi-file-earmark-text',
      csv: 'bi bi-file-earmark-spreadsheet'
    };
    return map[ext.toLowerCase()] || 'bi bi-file-earmark';
  }

  get allFiles() {
    return [
      ...this.documents.map(doc => ({
        type: 'existing',
        name: doc.title,
        file: null,            // add missing key
        url: doc.file,
        extension: doc.file.split('.').pop(),
        id: doc.id
      })),
      ...this.selectedFiles.map(file => ({
        type: 'new',
        name: file.name,
        file: file,
        url: null,             // add missing key
        extension: file.name.split('.').pop()
      }))
    ];
  }


  // In record.component.ts - IMPROVED saveRecord method
  saveRecord(): void {
    const fd = new FormData();

    // Append all form fields
    fd.append('name', this.form.name || '');
    fd.append('phone', this.form.phone || '');
    fd.append('profession', this.form.profession || '');
    fd.append('address', this.form.address || '');
    fd.append('etatdesante', this.form.healthStatus || '');

    // Append new files using a plural array-style key (adjust to backend expectation)
    // Many servers accept "documents[]" or "documents" for multiple files — match your API.
    this.selectedFiles.forEach(f => {
      fd.append('documents[]', f, f.name);
    });

    // Send only existing document IDs (backend usually expects IDs to keep them)
    const existingIds = this.documents.map((d: any) => d.id);
    fd.append('existingDocuments', JSON.stringify(existingIds));

    // Include deleted document ids if there are any
    if (this.deletedDocuments.length > 0) {
      fd.append('deletedDocuments', JSON.stringify(this.deletedDocuments));
    }

    // If editing existing patient, include the ID
    if (this.form.id) {
      fd.append('id', this.form.id.toString());
    }

    // Better FormData logging (show file names)
    console.log('Saving FormData with meta:', {
      id: this.form.id,
      name: this.form.name,
      filesCount: this.selectedFiles.length,
      documentsCount: this.documents.length,
      deletedDocuments: this.deletedDocuments
    });
    fd.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`FormData entry: ${key} => File(${value.name})`);
      } else {
        console.log(`FormData entry: ${key} =>`, value);
      }
    });

    this.save.emit(fd);
  }


  cancelRecord(): void {
    this.cancel.emit();
  }

  deleteExisting(index: number) {
    const doc = this.documents[index];
    this.deletedDocuments.push(doc.id);
    this.documents.splice(index, 1);
    this.cdr.detectChanges();
  }

}
