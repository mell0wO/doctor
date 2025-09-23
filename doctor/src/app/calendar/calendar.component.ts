import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter, CalendarView } from 'angular-calendar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, SidebarComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ]
})
export class CalendarComponent {
  CalendarView = CalendarView; // expose enum to template

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  events = [
    {
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // +1h
      title: 'Today\'s Event',
    }
  ];

  // --- Month view ---
  dayClicked(day: any) {
    this.viewDate = day.date;
    this.view = CalendarView.Day;
  }

  // --- Week view ---
  goToDay(event: { date: Date; sourceEvent: MouseEvent }) {
    this.viewDate = event.date;
    this.view = CalendarView.Day;
    console.log('Hour segment clicked (week):', event);
  }

  onHourSegmentClicked(event: any) {
    console.log('Day segment clicked:', event);

    // Ask user for event name
    const title = prompt('Enter event name:', 'New Event');

    if (title && title.trim() !== '') {
      const newEvent = {
        start: event.date,
        end: new Date(event.date.getTime() + 30 * 60 * 1000), // 30min duration
        title: title.trim(),
      };

      this.events = [...this.events, newEvent];
    }
  }


  onEventClicked(event: any) {
    console.log('Event clicked:', event);
  }

  onDoubleClick(event: any) {
    console.log('Double clicked:', event);
  }

  // --- Toolbar buttons ---
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    // optional if you add logic later
  }
}
