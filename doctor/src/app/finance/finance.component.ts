import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements AfterViewInit {
  @ViewChild('financeChart') financeChart!: ElementRef<HTMLCanvasElement>;

  debit = 0;
  credit = 0;
  profit = 0;

  // Define billings and quotes as empty arrays initially
  billings: any[] = [];
  quotes: any[] = [];

  Debit = [
  { label: 'Rent Payment', id: '2025-001', date: '08/01/2025', status: 'Paid', amount: '1 200 DT' },
  { label: 'Office Supplies', id: '2025-002', date: '09/01/2025', status: 'Paid', amount: '300 DT' },
  { label: 'Electricity Bill', id: '2025-003', date: '11/01/2025', status: 'Pending', amount: '500 DT' },
  { label: 'Internet Subscription', id: '2025-004', date: '15/01/2025', status: 'Paid', amount: '100 DT' },
  ];

  Credit = [
    { label: 'Client Payment A', id: '2025-101', date: '08/01/2025', status: 'Received', amount: '2 000 DT' },
    { label: 'Client Payment B', id: '2025-102', date: '10/01/2025', status: 'Pending', amount: '1 500 DT' },
    { label: 'Client Payment C', id: '2025-103', date: '12/01/2025', status: 'Received', amount: '800 DT' },
    { label: 'Client Payment D', id: '2025-104', date: '18/01/2025', status: 'Pending', amount: '1 200 DT' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize billings and quotes here
    this.billings = this.Debit;
    this.quotes = this.Credit;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateTotals();
      this.renderChart();
    }
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseAmount(amt: string): number {
    return parseFloat(amt.replace(/\s|DT/g, '').replace(',', '.')) || 0;
  }

  private updateTotals() {
    this.debit = this.Debit.reduce((sum, b) => sum + this.parseAmount(b.amount), 0);
    this.credit = this.Credit.reduce((sum, q) => sum + this.parseAmount(q.amount), 0);
    this.profit = this.debit - this.credit;
  }

  renderChart() {
    if (!this.financeChart?.nativeElement) {
      console.error('Canvas element not found!');
      return;
    }

    const existingChart = Chart.getChart(this.financeChart.nativeElement);
    if (existingChart) existingChart.destroy();

    // Group Debit and Credit data by date
    const groupedData: { [key: string]: { debit: number; credit: number } } = {};

    this.Debit.forEach(entry => {
      const date = entry.date;
      const amount = this.parseAmount(entry.amount);
      if (!groupedData[date]) {
        groupedData[date] = { debit: 0, credit: 0 };
      }
      groupedData[date].debit += amount;
    });

    this.Credit.forEach(entry => {
      const date = entry.date;
      const amount = this.parseAmount(entry.amount);
      if (!groupedData[date]) {
        groupedData[date] = { debit: 0, credit: 0 };
      }
      groupedData[date].credit += amount;
    });

    // Prepare data for the chart
    const labels = Object.keys(groupedData).sort(); // Sort dates for chronological order
    const dailyDebit = labels.map(date => groupedData[date].debit);
    const dailyCredit = labels.map(date => groupedData[date].credit);

    new Chart(this.financeChart.nativeElement, {
      type: 'line',
      data: {
        labels, // X-axis labels (dates)
        datasets: [
          {
            label: 'Débit',
            data: dailyDebit, // Data points for "Débit"
            borderColor: '#009E73',
            backgroundColor: 'rgba(255, 77, 79, 0.2)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Crédit',
            data: dailyCredit, // Data points for "Crédit"
            borderColor: '#D55E00',
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  addDebit() {
    const label = prompt('Enter libellé for Débit:');
    const amount = prompt('Enter montant for Débit (DT):');

    if (label && amount) {
      this.Debit.push({
        label,
        id: 'D-' + Date.now(),
        date: this.formatDate(new Date()),
        status: 'Pending',
        amount: amount + ' DT'
      });
      this.updateTotals();
      this.renderChart();
    }
  }

  addCredit() {
    const label = prompt('Enter libellé for Crédit:');
    const amount = prompt('Enter montant for Crédit (DT):');

    if (label && amount) {
      this.Credit.push({
        label,
        id: 'C-' + Date.now(),
        date: this.formatDate(new Date()),
        status: 'Pending',
        amount: amount + ' DT'
      });
      this.updateTotals();
      this.renderChart();
    }
  }
}