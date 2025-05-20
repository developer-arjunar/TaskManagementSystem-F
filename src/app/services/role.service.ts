import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  API_URL = environment.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): any {
    return this.httpClient.get(this.API_URL + 'api/Roles');
  }
}
