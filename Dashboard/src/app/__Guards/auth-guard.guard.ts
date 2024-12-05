import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../__Services/auth.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; 
  }};
