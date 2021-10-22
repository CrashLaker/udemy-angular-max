import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {}
  userSub: Subscription;
  isAuthenticated = false

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user
      }
    )
  }

  ngOnDestroy(){
    this.userSub.unsubscribe()
  }
  onSaveData(){
    this.dataStorageService.storeRecipes()
  }

  onLogout(){
    this.authService.logout()
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe()
  }
}