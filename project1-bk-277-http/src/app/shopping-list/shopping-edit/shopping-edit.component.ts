import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing
      .subscribe(
        (index: number) => {
          this.editMode = true
          this.editedItemIndex = index;
          this.editedItem = this.slService.getIngredient(index)
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      )
  }

  onAddItem(form: NgForm){
    const value = form.value
    const ingredient = new Ingredient(value.name, value.amount)
    if (this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, ingredient)
    }else{
      this.slService.addIngredient(ingredient)
    }
    form.reset()
    this.editMode = false
  }

  onClear(){
    this.slForm.reset()
    this.editMode = false
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex)
    this.onClear()
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
