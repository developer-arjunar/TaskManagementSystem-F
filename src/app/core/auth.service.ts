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

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      this.loggedIn.next(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  authenticateUser(userAuthenticationData: any): Observable<any> {
    // if (username === 'admin' && password === 'admin123') {
    //   this.loggedIn.next(true);
    //   localStorage.setItem('isLoggedIn', 'true');
    //   return true;
    // }
    // this.httpClient.post(this.API_URL + 'api/Users/AuthenticateUser', userAuthenticationData, {observe: 'response'})
    //   .subscribe({
    //     next: (response: HttpResponse<{}>) => {
    //       this.loggedIn.next(true);
    //       this.storage.setItem('isLoggedIn', 'true');
    //     }
    //   }
    // );

    return this.httpClient.post(this.API_URL + 'api/Users/AuthenticateUser', userAuthenticationData, {
      observe: 'response'
    });
    
    

    // return false;
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}
