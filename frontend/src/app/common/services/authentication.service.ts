import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap, throwError } from 'rxjs';
import { ProfileService } from 'src/app/pages/tabs/profile/services/profile.service';
import { environment } from 'src/environments/environment';

interface AuthenticationRequest {
  email: string
  password: string
}

interface RegistrationRequest {
  name: string,
  phone_number: string,
  email: string,
  password: string
}
export interface UserResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: Date;
  roles: Role[];
}

export interface Role {
  id: number;
  rol: string;
}

export enum ELookup {
  TOKEN_NAME = "sb_s_token",
  REFRESH_TOKEN_NAME = "sb_s_refresh"

}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  API_URL = environment.API_URL;
  isUserLoggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public jwtHelper: JwtHelperService,
    public profileService: ProfileService
  ) { }

  userLogin(request: AuthenticationRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/auth/login`, { ...request, pass: request.password })
    .pipe(
      tap(response => {
        localStorage.setItem(ELookup.TOKEN_NAME, response.token);
        localStorage.setItem("USER", JSON.stringify(response.user));
        this.profileService.userSubject.next(response.user)
        return response
      })
    )
  }

  userRegister(request: any): Observable<UserResponse> {
    const { nombre: name, correo: email, password, telefono } = request
    const phone_number = "+52" + telefono
    console.log(phone_number)
    return this.http.post<UserResponse>(`${this.API_URL}/auth/register`, { name, email, password, phone_number })
    .pipe(
      tap(response => {
        localStorage.setItem(ELookup.TOKEN_NAME, response.token);
        localStorage.setItem("USER", JSON.stringify(response.user));
        this.profileService.userSubject.next(response.user)
        return response
      })
    )
  }


  get token() {
    let token: string = localStorage.getItem(ELookup.TOKEN_NAME) ?? '';
    return token;
  }
  get username() {
    let tokenDecoded = this.jwtHelper.decodeToken(this.token);
    return tokenDecoded.sub;
  }

  public isAuthenticated(): boolean {
    if (this.token != '' && this.jwtHelper.isTokenExpired(this.token)) {
      let token: any = localStorage.getItem(ELookup.REFRESH_TOKEN_NAME);
      localStorage.setItem(ELookup.TOKEN_NAME, token);
    }

    this.isUserLoggedIn = !this.jwtHelper.isTokenExpired(this.token);
    return this.isUserLoggedIn;
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  logout() {
    localStorage.removeItem(ELookup.TOKEN_NAME);
    localStorage.removeItem("USER");
    this.profileService.userSubject.next({})
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/profile']));
  }

  private handleError(exception: HttpErrorResponse): Observable<never> {
    console.log(`Service Exception: ${exception.message}`);
    return throwError(`Service Exception: ${exception.message}`);
  }
}
