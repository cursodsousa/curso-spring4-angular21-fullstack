import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = ( request, next ) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const ehRequisicaoDeAutenticacao = request.url.includes('/auth/signin') || 
            request.url.includes('/auth/signup');

    if(!ehRequisicaoDeAutenticacao && authService.isTokenExpirado()){
        authService.logout(false);
        router.navigate(['/login']);
        return throwError(() => new Error('Token expirado.'));
    }

    const token = authService.getToken();
    const requestModificada = (!ehRequisicaoDeAutenticacao && token) ?
        request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) :
        request;

    return next(requestModificada).pipe(
        catchError( erro => {
            if(erro.status === 401){
                authService.logout(false);
                router.navigate(['/login']);
            }

            return throwError(() => erro);
        })
    )
}