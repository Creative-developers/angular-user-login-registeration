  import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from './user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL: string =  'http://localhost:5000/api';
  headers =  new HttpHeaders().set('Content-type', 'application/json');
  currentUser = {}
  constructor( private httpClient: HttpClient, private router:Router) { }

  registerUser(user:User): Observable<any> {
     return this.httpClient.post(`${this.API_URL}/users/register`, user).pipe(
       catchError(this.handleError)
     )
  }

  loginUser(user: User) {
      return this.httpClient.post<any>(`${this.API_URL}/auth`, user)
        .pipe(
          map(token => {
              console.log(token) 
              localStorage.setItem('access_token', token.token);
              return token;
          })
        )
        
  }

  getLoggedInUserProfile(token) :Observable<any> {
    if(this.isLoggedIn){
      return this.httpClient.get(`${this.API_URL}/users/profile/${token}`, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res ||  {};
        }),
        catchError(this.handleError)
      )
    }else{
      return throwError('User is not logged in');
    }
  }

  get isLoggedIn(): boolean {
      let authToken = localStorage.getItem('access_token');
      return (authToken !== null) ? true : false;
  }

  logout() {
    console.log('sdfsdfds');
    if(localStorage.removeItem('access_token') == null) {
      this.router.navigate(['login']);
    }
  }

  getAccessToken(){
    return localStorage.getItem('access_token');
  }


  handleError(error: HttpErrorResponse){
    let msg = '';
    console.log(error.status)
    //msg =  error.error.err;
    if(error.status === 400){
       msg = error.error.message;
    }else{
      msg = 'Something went wrong! Please try again later.';
    }
    console.info(msg)
    return throwError(msg);
  }

}
