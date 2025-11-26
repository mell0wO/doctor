import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter, CalendarView } from 'angular-calendar';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SearchComponent } from '../search/search.component';
import { AppointmentService } from '../../../../services/appointment.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    SidebarComponent,
    SearchComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ]
})
export class CalendarComponent implements OnInit {

  constructor(private appointmentService: AppointmentService) {}

  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  events: any[] = [];

  showSearch = false;
  selectedDate!: Date;

  ngOnInit() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.events = data.map(a => ({
          title: a.patient_name,
          start: new Date(a.start),
          end: new Date(a.end),
        }));
      },
      error: (err) => console.error("Failed to load appointments:", err)
    });
  }

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
    this.selectedDate = event.date;
    this.showSearch = true;
  }

  // --- Save event ---
  onRecordSelected(name: string) {
    const newEvent = {
      patient_name: name,
      start: this.selectedDate,
      end: new Date(this.selectedDate.getTime() + 30 * 60 * 1000),
    };

    this.appointmentService.createAppointment(newEvent).subscribe({
      next: (saved) => {
        this.events = [
          ...this.events,
          {
            title: saved.patient_name,
            start: new Date(saved.start),
            end: new Date(saved.end)
          }
        ];
      },
      error: (err) => console.error("Failed to save appointment:", err)
    });

    this.showSearch = false;
  }

  onSearchCancel() {
    this.showSearch = false;
  }

  onDoubleClick(event: any) {
    this.selectedDate = event?.date ?? new Date();
    this.showSearch = true;
  }

  onEventClicked(payload: any) {
    const clickedEvent = payload?.event ?? payload;
    if (clickedEvent?.start) {
      this.viewDate = clickedEvent.start;
      this.view = CalendarView.Day;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {}
}
