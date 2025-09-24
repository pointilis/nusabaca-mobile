import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // URLs that should be excluded from automatic token attachment
  const excludedUrls = [
    '_allauth/app/v1/auth/provider/token.json',
    // Add more URLs as needed
  ];

  // Check if the current request URL should be excluded
  const shouldExcludeToken = excludedUrls.some(excludedUrl => 
    req.url.includes(excludedUrl)
  );

  // Add base URL if the request URL is relative
  let modifiedReq = req;
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const baseUrl = environment.apiUrl;
    modifiedReq = req.clone({ url: baseUrl + req.url });
  }

  // If URL should be excluded from token, proceed without adding authorization
  if (shouldExcludeToken) {
    return next(modifiedReq);
  }

  // Get token and add Authorization header
  return from(authService.getToken()).pipe(
    switchMap(token => {
      token = token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYxMjM0NTcwLCJpYXQiOjE3NTg2NDI1NzAsImp0aSI6IjVlMjA5MTQ3MDczNjQ4MzI5NGZmODJkMmU0NTBhNzVjIiwidXNlcl9pZCI6IjIifQ.coTgn1kavzgQELt0Ebz6KNwbCMdcPuptZOYTgpOlePk';
      if (token) {
        const authReq = modifiedReq.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      } else {
        // No token available, proceed without authorization header
        return next(modifiedReq);
      }
    })
  );
};
