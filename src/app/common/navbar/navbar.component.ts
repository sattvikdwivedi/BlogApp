import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { filter, Observable, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { UtilsService } from '../../services/utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  
  constructor(
    private _utils: UtilsService,
    private _authService: AuthService,
    private _router: Router
  ) { }
  page: Observable<string> | undefined;
  User: Observable<User> | undefined;
  isLoading = true; // Add loading state
  User$: Observable<User | null> | undefined;
  
  
  ngOnInit(): void {
    this.page = this._utils.page;
    this.User$ = this._authService.$User.asObservable();
    this.User = this._authService.$User.pipe(
      filter((user): user is User => user !== null),
      tap(() => this.isLoading = false) // Set loading to false when user data arrives
    );
    if (!this._authService.$User.getValue()) {
      this._authService.fetchUserData().subscribe();
    }
  }


  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
