import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import * as fromApp from '../store/app.reducer' 
import * as ShoppingListActions from './store/shopping-list.actions'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private igChangeSub: Subscription;

  constructor(private loggingService: LoggingService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
    // this.loggingService.pringLog('hello from shopping list service')
    // this.ingredients = this.slService.getIngredients();
    // this.slService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients
    //   })
  }

  ngOnDestroy(): void {
    //this.igChangeSub.unsubscribe()
  }

  onEditItem(index: number){
    //this.slService.startedEditing.next(index)
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
