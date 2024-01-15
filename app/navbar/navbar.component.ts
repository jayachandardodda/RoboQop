import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServService } from 'src/app/shared/services/serv.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public serv: ServService, private authService: AuthService) { }
  showProfile: boolean = false;
  options = ['Profile', 'Log Out']
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((result: boolean) => this.showProfile = result);
  }
  @ViewChild('largeModal') largeModal: any;

  displayStyle = "none";

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

}
