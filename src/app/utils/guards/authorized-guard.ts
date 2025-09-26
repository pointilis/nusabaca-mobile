import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const authorizedGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = await authService.isAuthenticated();
  
  if (!isAuthenticated) {
    await router.navigate(['/']);
    return false;
  }

  return true;
};
