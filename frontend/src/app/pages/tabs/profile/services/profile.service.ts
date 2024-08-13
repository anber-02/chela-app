import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  user = {}

  public userSubject = new BehaviorSubject<object>(this.user)
  public user$ = this.userSubject.asObservable()

  constructor() {
    this.getUserInfo()
  }

  getUserInfo() {
    const user = JSON.parse(localStorage.getItem('USER') ?? '{}')
    this.userSubject.next(user)
  }
}
