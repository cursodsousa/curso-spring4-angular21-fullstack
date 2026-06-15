import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/cadastro');

  if (!isAuthRequest && authService.isTokenExpirado()) {
    authService.logout(false);
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado.'));
  }

  const token = authService.getToken();
  const authReq = !isAuthRequest && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout(false);
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
