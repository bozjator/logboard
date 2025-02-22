import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const loggedIn = authService.password.length > 0;
  if (!loggedIn) router.navigateByUrl('/');

  return loggedIn;
};
