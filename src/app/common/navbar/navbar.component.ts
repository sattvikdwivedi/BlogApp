import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { filter, Observable } from 'rxjs';

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
  page: Observable<string> | undefined;
  User: Observable<User> | undefined;

  constructor(
    private _utils: UtilsService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.page = this._utils.page;
    this.User = this._authService.$User.pipe(filter((user): user is User => user !== null));
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
