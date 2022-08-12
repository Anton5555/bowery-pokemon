import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserInfo } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private loginURL = 'https://reqres.in/api/login';

  isLoggedIn() {
    let hasToken = false;
    if (!!localStorage.getItem('token')) {
      hasToken = true;
    }
    return hasToken;
  }

  public login( userInfo: UserInfo ): Observable<any> {
    return this.http.post<UserInfo>(this.loginURL, userInfo)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError( error: any ) {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      message = `Error: ${error.error.message}`;
    } else {
      message = `Error Code ${error.status}: ${error.error.error}`;
    }
    return throwError(() => { return message });
  }

  setToken(token: string) {
    localStorage.setItem('token', token); 
  }

}
