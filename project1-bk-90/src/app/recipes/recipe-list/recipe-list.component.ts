import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a recipe', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0Kn5r-34p7-JuZD9_V6tsiKyqHUdSInscg&usqp=CAU'),
    new Recipe('Another Recipe', 'This is simply a recipe', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0Kn5r-34p7-JuZD9_V6tsiKyqHUdSInscg&usqp=CAU'),
  ];
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe)
  }

}
