import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../interfaces/login-model';
import { UtilsService } from './../services/utils.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterModule  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginData: LoginModel = {
    sub: null,
    error: null,
    loading: false,
    data: {
        email: null,
        password: null
    }
  }

  constructor(
    private _utils: UtilsService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._utils.page.next('login');
  }
  
  ngOnDestroy(): void {
    this._utils.page.next('');
  }

  login() {
    this.loginData.data = this._utils.trimObject(this.loginData.data);
    
    this.loginData.error = null;
    this.loginData.loading = true;
    
    this.loginData.sub = this._authService.login(this.loginData.data)
    .subscribe(res => {

      this.loginData.loading = false;
      this.loginData.sub?.unsubscribe();
      this._router.navigate(['/profile', res.user._id]);
      
    }, err => {
      
      this.loginData.error = err;
      this.loginData.loading = false;
      this.loginData.sub?.unsubscribe();

    })
  }

}
