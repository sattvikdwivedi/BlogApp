import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ErrorService } from './error.service';
import { LocalStorageService } from './local-storage.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  apiUrl: any;

  constructor(
    private _http: HttpClient,
    private _errorService: ErrorService,
    private _localStorageService: LocalStorageService,
    
  ) { }

  writeBlog(data:any) {
    return this._http.post(`${environment.apiUrl}/blog`, data)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  postComment(data:any) {
    return this._http.post(`${environment.apiUrl}/blog/comment`, data)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  postReact(data:any) {
    return this._http.put(`${environment.apiUrl}/blog/react`, data)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  getblogList(bloggerId: String, categoryId: String, page = 1, status?: String) {
    let url = `${environment.apiUrl}/blog/${bloggerId}/${categoryId}?page=${page}`;
    
    // If status is provided, add it to the query string
    if (status) {
      url += `&status=${status}`;
    }
  
    return this._http.get(url)
      .pipe(
        catchError(err => this._errorService.handleError(err))
      );
  }
  

  getPublishedBlogList(bloggerId: String, categoryId: String, page = 1) {
    return this._http.get(`${environment.apiUrl}/blog/published/${bloggerId}/${categoryId}?page=${page}`)
      .pipe(
        catchError(err => this._errorService.handleError(err))
      );
  }

  getBlogDetails(blogId:string) {
    return this._http.get(`${environment.apiUrl}/blog/details/${blogId}`)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }
  deleteBlogAsAdmin(blogId: string) {
    const accessToken = this._localStorageService.getAccessToken();
    const headers = {
      'Authorization': `Bearer ${accessToken}`  // Add Authorization header with Bearer token
    };
    
    return this._http.delete(`${environment.apiUrl}/admin/posts/${blogId}`, { headers })
      .pipe(
        catchError(err => this._errorService.handleError(err))
      );
  }

  getBlogById(id: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/blog/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  updateBlog(id: string, formData: FormData): Observable<any> {
    const token = this._localStorageService.getAccessToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this._http.put(`${environment.apiUrl}/blog/update/${id}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error.message || error.message;
    }
    return throwError(errorMessage);
  }
  
  

}
