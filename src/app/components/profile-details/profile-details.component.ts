import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent implements OnInit {

  public currentUserData: any = {};

  constructor(
      private storage: StorageService
    ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');
  }

}
