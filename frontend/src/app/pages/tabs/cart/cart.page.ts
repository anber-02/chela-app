import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { bagHandleOutline, trashOutline } from 'ionicons/icons';

import io, { type Socket } from 'socket.io-client'

import { CartService } from './services/cart.service';
import { CardComponent } from './components/card/card.component';
import { Router } from '@angular/router';

interface IOrder {
  user_id: number
  products: IProductOrder[]
}
interface IProductOrder {
  quantity:number,
  unit_price: number,
  total: number,
  product_id: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CardComponent, AsyncPipe]
})
export class CartPage {
  socket!: Socket
  event: string = 'createOrder'

  public cartService = inject(CartService)
  private router: Router = inject(Router);

  public totalAmount$ !: Observable<number>
  public totalItem = 0

  constructor() {
    addIcons({
      trashOutline, bagHandleOutline
    })
    this.totalAmount$ = this.cartService.totalAmount$;
  }

  createOrder() {
    const user = JSON.parse(localStorage.getItem("USER") ?? "[]")
    const token = localStorage.getItem("sb_s_token")

    if(!user || !token) {
      this.router.navigate(['/login'])
    }

    this.socket = io('http://localhost:3000', {
      auth: {
        id: user.id,
        name: user.name,
        rol: user.roles[0]?.rol ?? "user",
        token:token
      }
    })


    this.socket.connect()

    const products = this.cartService.products().map(item => {
      return {
        quantity: item.quantity,
        unit_price: item.price,
        total: item.total,
        product_id: item.id
      }
    })

    const order: IOrder = {
      user_id: user.id,
      products
    }
    console.log(order)

    this.socket.emit(this.event, order)
    // this.socket.disconnect()
    this.cartService.clearCart()
  }
}
// get-orders - admin
// orders-by-user
