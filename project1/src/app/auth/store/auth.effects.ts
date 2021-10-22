import { HttpClient } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { catchError, switchMap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { tap } from 'rxjs/operators'

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
}

import * as AuthActions from './auth.actions'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { User } from '../user.model'
import { AuthService } from '../auth.service'
import { registerLocaleData } from '@angular/common'

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string,
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn*1000)
  const user = new User(email, userId, token, expirationDate)
  // this.autoLogout(expiresIn*1000)
  localStorage.setItem('userData', JSON.stringify(user))
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  })
}

const handleError = (err: any) => {
  if (!err.error || !err.error.error)
    return of(new AuthActions.AuthenticateFail(err.message))

  return of(new AuthActions.AuthenticateFail(err.error.error.message))
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken,
          )
        }),
        catchError(err => {
          return handleError(err)
        }), 
      )
    })
  )


  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn*1000)
          // this.authService.setLogoutTimer(3000)
        }),
        map(resData => {
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken,
          )
        }),
        catchError(err => {
          return handleError(err)
        }), 
      )
    })
  )

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string,
      } = JSON.parse(localStorage.getItem('userData'))

      console.log('userdata', userData)

      if (!userData){
        return { type: 'DUMMY' }
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      )

      if (loadedUser.token){
        // this.autoLogout(
        //   new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        // )
        //this.user.next(loadedUser)
        this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime())
        console.log('token ok')
        return new AuthActions.AuthenticateSuccess({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        })
      }

      return {
        type: 'DUMMY'
      }
    })
  )

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS), 
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect)
        this.router.navigate(['/'])
    })
  )

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer()
      localStorage.removeItem('userData')
      this.router.navigate(['/auth'])
    })
  )

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

}