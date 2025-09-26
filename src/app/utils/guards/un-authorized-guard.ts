import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const unAuthorizedGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = await authService.isAuthenticated();
  
  if (isAuthenticated) {
    await router.navigate(['/tabs/home']);
    return false;
  }

  return true;
};
