import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListingService } from 'src/app/shared/services/listing.service'; 

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(private router: Router, private modal: NgbModal, private service: ListingService) { }

  ngOnInit(): void {
  }
  closeForm() {
    this.modal.dismissAll();
  }
  go() {
    this.service.next(true)
    this.modal.dismissAll()
  }
}
