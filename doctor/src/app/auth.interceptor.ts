import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');


  return next(
    req.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    })
  );
};
