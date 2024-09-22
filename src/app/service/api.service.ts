import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../interface/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serviceURL : string;

  constructor( private http : HttpClient) {
    this.serviceURL = 'https://dev.bakeconnect.app/api/todo-list';
   }

   addTask(task : Task) : Observable<Task> {
    return this.http.post<Task>(this.serviceURL,task);
  }

  getAllTask() : Observable<Task[]> {
    return this.http.get<Task[]>(this.serviceURL);
  }

  deleteTask(task : Task) : Observable<Task> {
    return this.http.delete<Task>(this.serviceURL+'/'+task.id);
  }

  editTask(task : Task) : Observable<Task> {
    return this.http.put<Task>(this.serviceURL+'/'+task.id,task);
  }
}
