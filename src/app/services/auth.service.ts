import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { User } from '../interfaces/user';
import { ErrorService } from './error.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $User: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private _userSubject = new BehaviorSubject<any>(null); // Make sure to initialize it with the current user or null.


  constructor(
    private _http: HttpClient,
    private _localStorageService: LocalStorageService,
    private _errorService: ErrorService
  ) { 
   this.loadUser();
  }
  loadUser() {
    // Assuming you're storing user data in localStorage or sessionStorage.
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this._userSubject.next(user);
  }

  signUp(data:any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/user/register`, data)
    .pipe(
      tap(res => {
        this._localStorageService.setTokens(res.accessToken, res.refreshToken);
        this.$User.next(res.user);
      }),
      catchError(err => this._errorService.handleError(err))
    );
  }

  login(data:any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/user/login`, data)
    .pipe(
      tap(res => {
        this._localStorageService.setTokens(res.accessToken, res.refreshToken);
        this.$User.next(res.user);
      }),
      catchError(err => this._errorService.handleError(err))
    )
  }

  logout() {
    this._localStorageService.clearTokens();
    this.$User.next(null);
  }

  fetchUserData(): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}/user/me`)
    .pipe(
      tap(res => {
        this.$User.next({
          _id: res._id,
          first_name: res.first_name,
          role: res.role
        })
      }),
      catchError(err => this._errorService.handleError(err))
    )
  }

  editUser(data:any) {
    return this._http.put(`${environment.apiUrl}/user/editProfile`, data)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  getLoggedInUserData(): Observable<any> {
    console.log('Sending token:', localStorage.getItem('accessToken'));
    return this.$User.pipe(
      switchMap(u => {

        if( u ) {
          return of(u)
        }

        const accessToken = this._localStorageService.getAccessToken();
        if( accessToken ) {
          return this.fetchUserData();
        }

        return of(null);

      })
    )
  }

  refreshToken(): Observable<{accessToken: string, refreshToken: string}> {
    const refreshToken = this._localStorageService.getFreshToken();
    return this._http.post<{accessToken: string, refreshToken: string}>(`${environment.apiUrl}/user/me/refresToken`, {refreshToken})
    .pipe(
      tap(res => {
        console.log('Token refreshed!');
        this._localStorageService.setTokens(res.accessToken, res.refreshToken)
      })
    )
  }

  getBloggerProfile(bloggerId: String) {
    return this._http.get(`${environment.apiUrl}/user/bloggerProfile/${bloggerId}`)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    )
  }
  canEditOrDelete(blogOwnerId: string): boolean {
    const user = this.$User.getValue();
    if (!user) return false; // If no user is logged in, can't edit or delete
    return user._id === blogOwnerId || user.role === 'admin'; // Check if the user is the blog owner or admin
  }
  uploadProfilePicture(file: File,userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('img', file);
    formData.append('userId', userId);
    

  
    return this._http.put(`${environment.apiUrl}/user/uploadProfilePicture`, formData)
      .pipe(
        tap((res: any) => {
          // Update the User BehaviorSubject if needed
          if (res?.user) {
            this.$User.next(res.user);
          }
        }),
        catchError(err => this._errorService.handleError(err))
      );
  }
  
}

