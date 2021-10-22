import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService } from "./auth.service";

import { Store } from "@ngrx/store";
import *  as AuthActions from "./store/auth.actions";
import * as fromApp from '../store/app.reducer'


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error = null
  private closeSub: Subscription;
  private storeSub: Subscription;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>){}
  ngOnInit(){
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.authError
      if (this.error){
        this.showErrorAlert(this.error)
      }
    })
  }

  ngOnDestroy(){
    if (this.storeSub)
      this.storeSub.unsubscribe()
    if (this.closeSub)
      this.closeSub.unsubscribe()
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm){
    if (!form.valid) return
    const email = form.value.email
    const password = form.value.password
    this.isLoading = true

    // let authObs = new Observable<AuthResponseData>();

    if (this.isLoginMode){
      //authObs = this.authService.login(email, password)
      this.store.dispatch(new AuthActions.LoginStart({email,password}))
    }else{
      // authObs = this.authService.signup(email, password)
      this.store.dispatch(new AuthActions.SignupStart({email,password}))
    }

    // authObs.subscribe(
    //   data => {
    //     console.log(data)
    //     this.isLoading = false
    //     this.router.navigate(['/recipes'])
    //   },
    //   err => {
    //     this.isLoading = false
    //     this.error = err
    //     this.showErrorAlert(err)
    //   }
    // )
    form.reset()
  }

  onHandleError(){
    // this.error = null
    this.store.dispatch(new AuthActions.ClearError())
  }

  private showErrorAlert(message: string){
    const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()
    const componentRef = hostViewContainerRef.createComponent(alertCompFactory)

    componentRef.instance.message = message
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }
}
