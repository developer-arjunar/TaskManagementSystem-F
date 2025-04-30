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

  getAllTasks(): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Tasks');
  }

  getTaskById(id: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Tasks/' + id);
  }

  getTaskByAssigneeId(assigneeId: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Tasks/byAssigneeId/' + assigneeId);
  }

  getTaskByStatus(status: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Tasks/byStatus/' + status);
  }

  getTaskByAssigneeIdAndStatus(assigneeId: any, status: any): Observable<any> {
    return this.httpClient.get(this.API_URL + 'api/Tasks/byAssigneeIdAndStatus/' + assigneeId + '/' + status);
  }

  updateTask(id: any, taskUpdateData: any): Observable<any> {
    return this.httpClient.put(this.API_URL + 'api/Tasks/' + id, taskUpdateData);
  }

  deleteTask(id: any): Observable<any> {
    return this.httpClient.delete(this.API_URL + 'api/Tasks/' + id);
  }

  addNewComment(taskCommentData: any): Observable<any> {
    return this.httpClient.post(this.API_URL + 'api/Comments', taskCommentData);
  }
}
