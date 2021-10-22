import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

import { AuthResponseData } from "./auth.service";



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  error = null

  constructor(private authService: AuthService,
              private router: Router){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm){
    if (!form.valid) return
    const email = form.value.email
    const password = form.value.password
    this.isLoading = true

    let authObs = new Observable<AuthResponseData>();

    if (this.isLoginMode){
      authObs = this.authService.login(email, password)
    }else{
      authObs = this.authService.signup(email, password)
    }
    authObs.subscribe(
      data => {
        console.log(data)
        this.isLoading = false
        this.router.navigate(['/recipes'])
      },
      err => {
        this.isLoading = false
        this.error = err
      }
    )
    form.reset()
  }
}
