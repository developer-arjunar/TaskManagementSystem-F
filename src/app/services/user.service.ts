import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = environment.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): any {
    return this.httpClient.get(this.API_URL + 'api/Users');
  }

  // getAllUsers(): any {
  //   return this.httpClient.get(this.API_URL + 'api/Users', {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'X-Requested-With': 'XMLHttpRequest'
  //     })
  //   });
  // }
}
