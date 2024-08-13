import { Component, inject, Input, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { add, remove, trashOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-card-item',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [IonicModule, AsyncPipe]
})
export class CardComponent  implements OnInit {

  @Input() product !: CartItem

  public cartService = inject(CartService)
  public totalAmount$ !: Observable<number>

  constructor() {
    addIcons({
       remove, add, trashOutline
    })
  }

  ngOnInit() {
    this.totalAmount$ = this.cartService.totalAmount$;
  }
}
