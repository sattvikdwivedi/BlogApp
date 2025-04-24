import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.getLoggedInUserData().pipe(
      map(user => {
        const isNotLoggedIn = !user;
        
        if (!isNotLoggedIn) {
          // If the user *is* logged in, block access to this route
          return this._router.createUrlTree(['/all_blogs']);
        }
        // If the user is *not* logged in, allow access
        return true;
      })
    );
  }
  
  
}
