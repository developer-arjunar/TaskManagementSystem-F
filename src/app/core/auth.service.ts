import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.BASE_URL;

  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private storage: StorageService
  ) { }

  login(statusCode: any): boolean {
    if (statusCode == 200) {
      this.loggedIn.next(true);
      this.storage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn.next(false);
    this.storage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}
