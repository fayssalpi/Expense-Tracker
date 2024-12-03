import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../__Services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Access AuthService
  const authToken = authService.getToken(); // Retrieve the stored JWT token

  if (authToken) {
    // Clone the request and add the Authorization header with the Bearer token
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return next(clonedRequest); // Pass the cloned request
  }

  return next(req); // Pass the original request if no token exists
};
