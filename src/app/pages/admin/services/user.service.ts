import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) {


   }

   getAll():Observable<any[]>{
    return this.http
    .get<any>(`${environment.BASE_URL}/user`);
  }

  new(user):Observable<any>{
    return this.http.post<any>(`${environment.BASE_URL}/user`,user)
    .pipe(catchError(this.handlerError));
  }


  update(userId:number, user):Observable<any>{
    return this.http.put<any>(`${environment.BASE_URL}/user/${userId}`,user)
    .pipe(catchError(this.handlerError));
  }



  delete(userId:number):Observable<{}>{
    return this.http.delete(`${environment.BASE_URL}/user/${userId}`)
    .pipe(catchError(this.handlerError));
  }
  

  
   
  handlerError(error:Error):Observable<never>{
    let errorMessage = 'Error desconocido';
    if(error){
        errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  
}
