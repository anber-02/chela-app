import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';

interface State {
  loading: boolean,
  categories: Category[]
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient)

  #state = signal<State>({
    loading: true,
    categories: []
  })

  public categories = computed(() => this.#state().categories)
  public loading = computed(() => this.#state().loading)

  constructor() {
    this.http.get<Category[]>(`${environment.API_URL}/category`)
      .subscribe((res) => {
        this.#state.set({
          loading: false,
          categories: res
        })
      })
  }
}
