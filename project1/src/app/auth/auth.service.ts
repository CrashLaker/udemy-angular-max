import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Injectable({providedIn: 'root'})
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>){}
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[API_KEY]

  setLogoutTimer(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      // this.logout()
      this.store.dispatch(new AuthActions.Logout())
    }, expirationDuration)
  }

  clearLogoutTimer(){
    console.log('logout')
    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
  }
}
