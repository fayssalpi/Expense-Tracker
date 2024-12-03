import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../__Services/auth.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router for navigation

  if (authService.isAuthenticated()) {
    return true; // Allow navigation if the user is authenticated
  } else {
    router.navigate(['/login']); // Redirect to the login page if not authenticated
    return false; // Prevent navigation
  }};
