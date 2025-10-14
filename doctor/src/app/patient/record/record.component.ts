import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  @Input() title: string = '';
  @Input() link: string = ''; 

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  selectedFiles: File[] = [];
  isDragOver: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onContinue(): void {
    console.log("Continue button clicked");
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log("Selected files:", this.selectedFiles.map(f => f.name));
      input.value = ''; 
      this.cdr.detectChanges();
    }
  }

  removeFile(index: number): void {
    console.log("Deleting file:", this.selectedFiles[index].name);
    this.selectedFiles.splice(index, 1);
    console.log("Remaining files:", this.selectedFiles.map(f => f.name));
    this.cdr.detectChanges();
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

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const newFiles = Array.from(event.dataTransfer.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log("Dropped files:", this.selectedFiles.map(f => f.name));
      this.cdr.detectChanges();
    }
  }

  viewFile(file: File): void {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
    console.log("Viewing file:", file.name);
  }

  getFileIcon(extension: string | undefined): string {
    if (!extension) return 'bi bi-file-earmark';
    const iconMap: { [key: string]: string } = {
      'pdf': 'bi bi-file-earmark-pdf',
      'jpg': 'bi bi-file-earmark-image',
      'jpeg': 'bi bi-file-earmark-image',
      'png': 'bi bi-file-earmark-image',
      'zip': 'bi bi-file-earmark-zip',
      'rar': 'bi bi-file-earmark-zip',
      'txt': 'bi bi-file-earmark-text',
      'csv': 'bi bi-file-earmark-spreadsheet'
    };
    return iconMap[extension.toLowerCase()] || 'bi bi-file-earmark';
  }

  saveRecord(): void {
    try {
      console.log('Enregistrement réussi !');
      alert('L’enregistrement a été effectué avec succès !');
      this.save.emit(); // Emit save event
    } catch (error) {
      console.error('Erreur lors de l’enregistrement :', error);
    }
  }

  cancelRecord(): void {
    try {
      console.log('Opération annulée !');
      this.cancel.emit(); // Emit cancel event
    } catch (error) {
      console.error('Erreur lors de l’annulation de l’opération :', error);
    }
  }
}
