import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  
  constructor(private authService: AuthService) {}


  userRole = false;

  ngOnInit(): void {
    // No event available here
    // console.log("Sidebar initialized");
  }

  async logout(event?: Event) {
    this.authService.logout();  // call the logout from AuthService 
  }

}