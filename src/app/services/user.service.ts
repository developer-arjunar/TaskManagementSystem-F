import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = environment.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): any {
    return this.httpClient.get(this.API_URL + 'api/Users');
  }

  saveNewUser(userData: any): Observable<any> {
    return this.httpClient.post(this.API_URL + 'api/Users', userData);
  }

  getUserById(id: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Users/' + id);
  }

  checkUsernameIsExists(username: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Users/checkUsernameIsExists/' + username);
  }

  deleteUser(id: any): Observable<any> {
    return this.httpClient.delete(this.API_URL + 'api/Users/' + id);
  }

  updateProfileDetails(id: any, profileDetailsUpdateData: any): Observable<any> {
    return this.httpClient.put(this.API_URL + 'api/Users/updateProfileDetails/' + id, profileDetailsUpdateData);
  }

  updateAccountDetails(id: any, accountDetailsUpdateData: any): Observable<any> {
    return this.httpClient.put(this.API_URL + 'api/Users/updateAccountDetails/' + id, accountDetailsUpdateData);
  }

  updatePassword(id: any, passwordUpdateData: any): Observable<any> {
    return this.httpClient.put(this.API_URL + 'api/Users/updatePassword/' + id, passwordUpdateData);
  }
}
