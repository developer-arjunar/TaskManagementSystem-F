import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  API_URL = environment.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  saveNewTask(taskData: any): Observable<any> {
    return this.httpClient.post(this.API_URL + 'api/Tasks', taskData);
  }
}
