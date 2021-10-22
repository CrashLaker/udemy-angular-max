import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store'
import * as fromApp from '../../store/app.reducer'
import { map, take, tap } from 'rxjs/operators'
import * as RecipesActions from '../store/recipe.actions'
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = +params.id
      this.id = id
      // this.recipe = this.recipeService.getRecipeId(id)
      this.store
        .select('recipes')
        .pipe(
          take(1),
          map(
            recipesState => {
              return recipesState.recipes.find((recipe, idx) => {
                if (idx == id)
                  return recipe
              })
            }
          )
        ).subscribe(recipe => {
          this.recipe = recipe
        })
    })
  }

  onAddToShoppingList(){
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  onDeleteRecipe(){
    //this.recipeService.deleteRecipe(this.id)
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }

}
