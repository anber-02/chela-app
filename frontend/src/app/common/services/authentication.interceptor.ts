import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  console.log("Auth Inteceptor");
  const authenticationService = inject(AuthenticationService)
  if (!authenticationService.isAuthenticated()) {
    request = request.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } else {
    request = request.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationService.token}`
      },
    });
  }
  return next(request);
};
