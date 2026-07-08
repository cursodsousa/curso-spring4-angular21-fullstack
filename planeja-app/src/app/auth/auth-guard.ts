import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth-service";

export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isAutenticado()){
        return true;
    }

    authService.logout(false);

    return router.createUrlTree(['/login']);
}