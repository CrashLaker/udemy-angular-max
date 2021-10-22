import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from "../auth/auth.service";
import * as fromApp from '../store/app.reducer'
import { Store } from "@ngrx/store";
import * as RecipesActions from '../recipes/store/recipe.actions'

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private store: Store<fromApp.AppState>){}

  rootUrl = 'https://ng-course-recipe-book-54695-default-rtdb.firebaseio.com/'
  recipeUrl = this.rootUrl+'recipes.json'

}