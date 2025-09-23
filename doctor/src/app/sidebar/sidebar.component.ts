import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  userRole = false;

  ngOnInit(): void {
    // No event available here
    console.log("Sidebar initialized");
  }

  async logout(event?: Event) {
    console.log("logout", event);
  }

  onManageAccount(event?: Event) {
    console.log("manage account", event);
  }
}