import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
}

import { User } from "./user.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router){}
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[API_KEY]

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACSewa83_qf1OruS2DUIw-2nd8XoTa1BI',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    )
    .pipe(catchError(this.handleError))
  }

  autoLogin(){
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string,
    } = JSON.parse(localStorage.getItem('userData'))
    if (!userData){
      return
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    )

    if (loadedUser.token){
      this.autoLogout(
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      )
      this.user.next(loadedUser)
    }
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACSewa83_qf1OruS2DUIw-2nd8XoTa1BI',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(res => {
        this.handleAuthentication(
          res.email, 
          res.localId, 
          res.idToken, 
          +res.expiresIn, 
        )
      })
    )
  }

  logout(){
    this.user.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData')
    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

  private handleAuthentication(email: string,
                               userId: string,
                               token: string,
                               expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000)
    const user = new User(
      email, 
      userId, 
      token, 
      expirationDate
    )
    this.user.next(user)
    this.autoLogout(expiresIn*1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(err: HttpErrorResponse){
      if (!err.error || !err.error.error)
        return throwError(err.message)

      return throwError(err.error.error.message)
  }
}
