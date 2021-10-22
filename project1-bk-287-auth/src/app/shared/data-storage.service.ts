import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipesService: RecipeService){}
  rootUrl = 'https://ng-course-recipe-book-54695-default-rtdb.firebaseio.com/'
  recipeUrl = this.rootUrl+'recipes.json'

  storeRecipes(){
    const recipes = this.recipesService.getRecipes()
    this.http.put(this.recipeUrl, recipes).subscribe(
      rs => {
        console.log(rs)
      }
    )
  }

  fetchRecipes(){
    return this.http
      .get<Recipe[]>(this.recipeUrl)
      .pipe(
        map(recipes => {
          return recipes.map(d => {
            return {
                ...d,
                ingredients: d.ingredients ? d.ingredients : []
            }
          })
        }),
        tap(recipes => {
          this.recipesService.setRecipes(recipes)
        })
      )
  }
}