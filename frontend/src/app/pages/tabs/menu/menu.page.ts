import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './services/products.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { ChipsCategoryComponent } from "../../../features/categories/components/chips-category/chips-category.component";
import { ProductCardComponent } from './components/product-card/product-card.component';
import { Product } from 'src/app/models/product.model';
import { ProductDetailModalComponent } from './components/product-detail-modal/product-detail-modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChipsCategoryComponent, ProductCardComponent]
})
export class MenuPage {


  products: Product[] = []
  public productsService = inject(ProductsService)

  constructor(private modalController: ModalController) { }

  searchProductsByCategory(category: number) {
    this.productsService.getProductByCategory(category)
  }

  receiveMessage($event: any) {
    this.searchProductsByCategory($event)
  }
  handleInputSearch(event: any){
    const query = event.target.value.toLowerCase()
    this.productsService.searchProductByName(query)
  }

  async openProductDetail(product: Product) {
    const modal = await this.modalController.create({
      component: ProductDetailModalComponent,
      componentProps: { product },
      cssClass: 'custom-modal',
      mode: 'ios'
    });
    return await modal.present();
  }
}
