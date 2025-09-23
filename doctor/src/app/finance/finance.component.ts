import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent {
  balance = 220;
  debt = 0;

  chartData = [
    {
      "name": "Cash at the end of the month",
      "series": [
        { "name": "Jan", "value": 150 },
        { "name": "Feb", "value": 180 },
        { "name": "Mar", "value": 120 },
        { "name": "Apr", "value": 200 },
        { "name": "May", "value": 250 },
        { "name": "Jun", "value": 220 },
        { "name": "Jul", "value": 300 }
      ]
    }
  ];

  // ✅ Proper Color object
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#84cc16'] // lime green
  };
}
