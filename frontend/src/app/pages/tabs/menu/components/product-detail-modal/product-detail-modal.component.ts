import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ProductDetailModalComponent{

  @Input() product!: Product;
  public cartService = inject(CartService)
  constructor(private modalController: ModalController, private toastController: ToastController) {
  }


  closeModal() {
    this.modalController.dismiss();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Producto agregado al carrito correctamente',
      duration: 1000,
      position: position,
      mode: 'ios'
    });

    await toast.present();
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
    this.presentToast('bottom')
  }
}
