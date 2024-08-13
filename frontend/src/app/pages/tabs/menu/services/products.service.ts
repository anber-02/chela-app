import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

interface State {
  loading: boolean,
  products: Product[]
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient)

  #state = signal<State>({
    loading: true,
    products: []
  })

  public products = computed(() => this.#state().products)
  public loading = computed(() => this.#state().loading)


  constructor(
  ) {
    this.http.get<Product[]>(`${environment.API_URL}/products`)
      .subscribe((res) => {
        this.#state.set({
          loading: false,
          products: res
        })
      })
  }

  getProductByCategory(category: number) {
    this.http.get<Product[]>(`${environment.API_URL}/products?category=${category}`).subscribe(res => {

      this.#state.set({
        loading: false,
        products: res
      })
    })
  }

  searchProductByName(name: string) {
    this.http.get<Product[]>(`${environment.API_URL}/products/search?termino=${name}`).subscribe(res => {
      this.#state.set({
        loading: false,
        products: res
      })
    })
  }

  saveProduct(data: { [key: string]: any }) {
    this.http.post<Product>(`${environment.API_URL}/products`, data)
  }
}
