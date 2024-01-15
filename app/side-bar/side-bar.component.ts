import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServService } from 'src/app/shared/services/serv.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit{

  public activeMenuItem: string
  public transition:boolean = false
  public selectedMenuItem: MenuItem | null = null;

  constructor(private authService: AuthService, public serv:ServService, private cdr:ChangeDetectorRef, private router:Router) {
    this.activeMenuItem = this.router.url;
  }
  items: MenuItem[];
  ngOnInit() {
    // this.serv.defaultMenu[0]['style'] = 'background-color: yellow; !important'
    console.log(this.serv.defaultMenu)
    this.serv.labelsChanged.subscribe(() => {
      // Perform actions when data changes
      // ...

      // Trigger change detection manually
      this.cdr.detectChanges();
    });
  }
  onMenuItemClick(item: MenuItem): void {
    console.log('Printing from onmenu selected')
    console.log(item)
    this.selectedMenuItem = item;
  }
  onLogOutClick() {
    this.authService.logout();
  }
  onSidenavOpen() {
    // do something when the sidenav is opened
  }

  onSidenavClose() {
    // do something when the sidenav is closed
  }


  toggleSubMenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  onMouseEnter(){
    this.transition = true
    this.serv.navToggleButton.next(false)
    this.serv.collapse()
  }

  onMouseLeave(){
    this.transition = false
    this.serv.navToggleButton.next(true)
    this.serv.collapse()
  }

  // onHover(){
  //   if (this.serv.navToggleButton.value==true) {
  //   this.items[0].label = ' '
  //   this.items[1].label = ' '
  //   this.items[1][0].label = ' '
  //   this.items[1][1].label = ' '
  //   this.items[2].label = ''
  //   this.items[2][0].label = ' '
  //   this.items[2][1].label = ' '
  //   this.items[2][2].label = ' '
  //   this.items[3].label = ' '
  //   }

  //   else {
  //     this.items[0].label = 'Home '
  //     this.items[1].label = 'Portfolio '
  //     this.items[1][0].label = 'model portfolio '
  //     this.items[1][1].label = 'create from scratch'
  //     this.items[2].label = 'Services'
  //     this.items[2][0].label = 'Index tracking'
  //     this.items[2][1].label = 'optimization'
  //     this.items[2][2].label = 'back testing'
  //     this.items[3].label = 'logout'
  //   }
  //   this.serv.navToggleButton.next(!this.serv.navToggleButton.value)

  // }
}
