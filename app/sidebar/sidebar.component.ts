import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Add any necessary properties and methods for your sidebar component
  menuItems = [
    {
      name: 'Home',
      icon: 'home',
      routerLink: '/home'
    },
    {
      name: 'Settings',
      icon: 'settings',
      routerLink: '/settings'
    },
    // Add more menu items here
  ];
}

