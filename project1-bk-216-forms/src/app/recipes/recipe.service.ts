import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model'

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe', 
      'This is simply a recipe', 
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0Kn5r-34p7-JuZD9_V6tsiKyqHUdSInscg&usqp=CAU',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
      ]
    ),
    new Recipe(
      'Another Recipe', 
      'This is simply a recipe', 
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0Kn5r-34p7-JuZD9_V6tsiKyqHUdSInscg&usqp=CAU',
      [
        new Ingredient('Buns', 1),
        new Ingredient('Meat', 2),
      ]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipeId(recipeId: number): Recipe{
    return this.recipes[recipeId];
  }

  getRecipes(){
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients)
  }
}