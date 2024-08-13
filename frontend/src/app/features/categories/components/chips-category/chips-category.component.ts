import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../models/category.model';
import { IonicModule } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-chips-category',
  template: `
  <div class="container-chips">
    <ion-chip (click)="sendCategory(0)">All</ion-chip>
  @for (category of categoriesService.categories(); track category.id) {
    <ion-chip (click)="sendCategory(category.id)">{{category.name}}</ion-chip>
  }
</div>
  `,
  imports: [IonicModule],
  standalone: true,
  styleUrls: ['./chips-category.component.scss'],
})
export class ChipsCategoryComponent implements OnInit {

  @Output() categoryEvent  = new EventEmitter<number>()
  // @Input() categories !: Category[]
  public categoriesService = inject(CategoryService)
  constructor() { }

  ngOnInit() {
    console.log('componente de categories')
  }

  sendCategory(category: number){
    this.categoryEvent.emit(category)
  }

}
