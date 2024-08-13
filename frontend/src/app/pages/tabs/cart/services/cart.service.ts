import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCart, CartItem } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';



@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly storageKey = 'shopping-cart'


  #cart = signal<ShoppingCart>(this.loadCartFromLocalStorage());

  public products = computed(() => this.#cart().items)

  // Convertimos el totalAmount en un observable ya que angular no detecta los cambios en objetos simples
  // En este caso pues es un numero
  private totalAmountSubject = new BehaviorSubject<number>(this.#cart().totalAmount)
  public totalAmount$ = this.totalAmountSubject.asObservable()

  addItem(product: Product) {

    const item = {
      ...product,
      quantity: 1,
      total: product.price
    }

    this.#cart.update((currentCart) => {
      const existingItem = currentCart.items.find(
        (i) => i.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.total += item.total;
      } else {
        currentCart.items.push(item);
      }

      currentCart.totalAmount = this.calculateTotalAmount(currentCart.items)
      this.totalAmountSubject.next(currentCart.totalAmount);
      this.saveCartToLocalStorage(currentCart);
      return currentCart;
    });
  }


  removeItem(productId: number) {
    this.#cart.update((currentCart) => {
      const itemIndex = currentCart.items.findIndex((i) => i.id === productId);

      if (itemIndex !== -1) {
        const item = currentCart.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.total -= item.price;
        } else {
          currentCart.items.splice(itemIndex, 1);
        }
        currentCart.totalAmount = this.calculateTotalAmount(currentCart.items)
        this.totalAmountSubject.next(currentCart.totalAmount);
      }

      this.saveCartToLocalStorage(currentCart);
      return currentCart;
    });
  }

   // Vaciar el carrito
   clearCart() {
    this.#cart.set({
      items: [], totalAmount: 0
    });
    localStorage.removeItem(this.storageKey);
  }

  private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.total, 0);
  }

  // Guardar el carrito en localStorage
  private saveCartToLocalStorage(cart: ShoppingCart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  // Cargar el carrito desde localStorage
  private loadCartFromLocalStorage(): ShoppingCart {
    const savedCart = localStorage.getItem(this.storageKey);
    if (savedCart) {
      return JSON.parse(savedCart)
    }
    return { items: [], totalAmount: 0 }
  }
}
