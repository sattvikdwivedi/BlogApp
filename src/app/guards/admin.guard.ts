import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    const user = this._authService.$User.getValue();
    if (user?.role === 'admin') {
      return true;
    } else {
      this._router.navigate(['/']);
      return false;
    }
  }
}
