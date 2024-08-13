import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';
import { Product } from 'src/app/models/product.model';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-product-card',
  template: `
      <ion-card>
        <ion-thumbnail>
          <ion-img [src]="product.image"></ion-img>
        </ion-thumbnail>

        <ion-label>
          <ion-text color="dark"><strong>{{product.product_name}}</strong></ion-text>
          <p>
            <ion-text color="dark">
              $<strong>{{product.price}}</strong>
            </ion-text>

              <ion-icon class="rating"  (click)="addToCart($event, product)" slot="icon-only" name="add-circle"></ion-icon>
          </p>
        </ion-label>
    </ion-card>
  `,
  standalone: true,
  styleUrls: ['./product-card.component.scss'],
  imports: [IonicModule]
})
export class ProductCardComponent implements OnInit {
  @Input() product !: Product
  public cartService = inject(CartService)

  constructor(
    private toastController: ToastController
  ) {
    addIcons({
      addCircle
    })
  }
  addToCart(event: Event, product: Product) {
    event.stopPropagation(); // Evita que se propague el evento al contenedor, esto para que no abra el modal del detail
    this.cartService.addItem(product);
    this.presentToast('bottom')
  }

  ngOnInit() {
    console.log('Componente que se carga al cargar el component')
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

}
