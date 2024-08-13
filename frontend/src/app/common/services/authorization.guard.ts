import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(public authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('Guard')
    // this will be passed from the route config
    // on the data property
    const expectedRoles = route.data['roles'];
    // decode the token to get its payload
    let tokenPayload: any = jwtDecode(this.authenticationService.token);
    let access = "null";

    if (this.authenticationService.isAuthenticated()) {
      if (expectedRoles.includes(tokenPayload.rol)) {
        access = "true";
      }
    }

    if (access === "true") {
      return true;
    }
    this.authenticationService.redirectTo('/');
    return false;
  }

}
