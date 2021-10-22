import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { ofType } from "@ngrx/effects";
import { switchMap, tap, map, withLatestFrom } from "rxjs/operators";
import { pipe } from "rxjs";
import * as RecipesActions from './recipe.actions'
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer'
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

  rootUrl = 'https://ng-course-recipe-book-54695-default-rtdb.firebaseio.com/'
  recipeUrl = this.rootUrl+'recipes.json'

  @Effect({dispatch: true})
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
            .get<Recipe[]>(this.recipeUrl)
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes)
    })
  )

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(this.recipeUrl, recipesState.recipes)
    }) 
  )









  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>){}
}