import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance',
  standalone: true,   
  imports: [CommonModule], 
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})

export class FinanceComponent implements AfterViewInit {
  debit = 15000000;
  credit = 15000000;
  profit = 15000000;

  salesData = [
    { date: 'Aug 1', sales: 3000, purchases: 2800 },
    { date: 'Aug 2', sales: 2500, purchases: 3200 },
    { date: 'Aug 3', sales: 4000, purchases: 2200 },
    { date: 'Aug 4', sales: 3500, purchases: 3700 },
    { date: 'Aug 5', sales: 4410, purchases: 3190 },
    { date: 'Aug 6', sales: 2800, purchases: 3300 },
    { date: 'Aug 7', sales: 4200, purchases: 2500 },
    { date: 'Aug 8', sales: 3700, purchases: 3800 },
    { date: 'Aug 9', sales: 4600, purchases: 3100 },
    { date: 'Aug 10', sales: 3900, purchases: 3500 }
  ];

  billings = [
    { label: 'Example-0', id: '2025-024', date: '08/01/2025', status: 'Paid', amount: '100 000 DT' },
    { label: 'Example-1', id: '2025-025', date: '09/01/2025', status: 'Overdue', amount: '15 000 DT' },
    { label: 'Example-2', id: '2025-022', date: '11/01/2025', status: 'Paid', amount: '12 500 DT' },
    { label: 'Example-3', id: '2025-021', date: '31/01/2025', status: 'Paid', amount: '1 000 DT' },
  ];

  quotes = [
    { label: 'Example-0', id: '2025-024', date: '08/01/2025', status: 'Paid', amount: '100 000 DT' },
    { label: 'Example-1', id: '2025-023', date: '09/01/2025', status: 'To-send', amount: '15 000 DT' },
    { label: 'Example-2', id: '2025-022', date: '11/01/2025', status: 'Paid', amount: '12 500 DT' },
    { label: 'Example-3', id: '2025-021', date: '21/01/2025', status: 'Paid', amount: '1 000 DT' },
  ];

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart() {
    new Chart("financeChart", {
      type: 'line',
      data: {
        labels: this.salesData.map(d => d.date),
        datasets: [
          {
            label: 'Sales',
            data: this.salesData.map(d => d.sales),
            borderColor: '#1890ff',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Purchases',
            data: this.salesData.map(d => d.purchases),
            borderColor: '#fa8c16',
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
