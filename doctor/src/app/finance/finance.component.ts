import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit, AfterViewInit {

  @ViewChild('financeChart') financeChart!: ElementRef<HTMLCanvasElement>;

  Debit: any[] = [];
  Credit: any[] = [];
  billings: any[] = [];
  quotes: any[] = [];
  debit: number = 0;
  credit: number = 0;
  profit: number = 0;

  constructor(
    private financeService: FinanceService, // Remove HttpClient from here
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {}

  loadData() {
    this.financeService.getEntries().subscribe({
      next: (entries: any) => {
        this.Debit = entries.filter((e: any) => e.entry_type === 'debit');
        this.Credit = entries.filter((e: any) => e.entry_type === 'credit');

        this.billings = this.Debit;
        this.quotes = this.Credit;

        this.updateTotals();

        if (isPlatformBrowser(this.platformId)) {
          this.renderChart();
        }
      },
      error: (error) => {
        // console.error('Error loading data:', error);
      }
    });
  }

  private formatDateForBackend(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private parseAmount(amt: string | number): number {
    if (typeof amt === 'number') return amt;
    return parseFloat(amt.replace(/\s|DT/g, '').replace(',', '.')) || 0;
  }

  private updateTotals() {
    this.debit = this.Debit.reduce((sum, b) => sum + this.parseAmount(b.amount), 0);
    this.credit = this.Credit.reduce((sum, q) => sum + this.parseAmount(q.amount), 0);
    this.profit = this.debit - this.credit;
  }

  renderChart() {
    if (!this.financeChart?.nativeElement) {
      // console.error('Canvas element not found!');
      return;
    }

    const existing = Chart.getChart(this.financeChart.nativeElement);
    if (existing) existing.destroy();

    const grouped: any = {};

    this.Debit.forEach(e => {
      const date = e.date;
      const amount = this.parseAmount(e.amount);
      if (!grouped[date]) grouped[date] = { debit: 0, credit: 0 };
      grouped[date].debit += amount;
    });

    this.Credit.forEach(e => {
      const date = e.date;
      const amount = this.parseAmount(e.amount);
      if (!grouped[date]) grouped[date] = { debit: 0, credit: 0 };
      grouped[date].credit += amount;
    });

    const labels = Object.keys(grouped).sort();
    const dailyDebit = labels.map(d => grouped[d].debit);
    const dailyCredit = labels.map(d => grouped[d].credit);

    new Chart(this.financeChart.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenus ',
            data: dailyDebit,
            borderColor: '#009E73',
            backgroundColor: 'rgba(255, 77, 79, 0.2)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Dépenses ',
            data: dailyCredit,
            borderColor: '#D55E00',
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  addDebit() {
    const label = prompt('Enter libellé for Débit:');
    const amount = prompt('Enter montant for Débit:');

    if (label && amount) {
      const entryData = {
        entry_type: 'debit',
        label: label,
        entry_id: 'D-' + Date.now(),
        date: this.formatDateForBackend(new Date()),
        status: 'Pending',
        amount: parseFloat(amount)
      };

      this.financeService.addEntry(entryData).subscribe({
        next: () => this.loadData(),
        // error: (error) => console.error('Error adding debit:', error)
      });
    }
  }

  addCredit() {
    const label = prompt('Enter libellé for Crédit:');
    const amount = prompt('Enter montant for Crédit:');

    if (label && amount) {
      const entryData = {
        entry_type: 'credit',
        label: label,
        entry_id: 'C-' + Date.now(),
        date: this.formatDateForBackend(new Date()),
        status: 'Pending',
        amount: parseFloat(amount)
      };

      this.financeService.addEntry(entryData).subscribe({
        next: () => this.loadData(),
        // error: (error) => console.error('Error adding credit:', error)
      });
    }
  }

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      // console.warn('Delete endpoint not implemented yet');
    }
  }

  editEntry(entry: any) {
    const newLabel = prompt('Enter new libellé:', entry.label);
    const newAmount = prompt('Enter new montant:', entry.amount.toString());

    if (newLabel && newAmount) {
      // console.warn('Update endpoint not implemented yet');
    }
  }
} 