import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipeClick = (event) => {
    console.log('recipeClick', event)
  }

  selectedRecipe: Recipe = null;

  constructor() { }

  ngOnInit(): void {
  }

}
