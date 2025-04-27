import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private _http: HttpClient,
    private _errorService: ErrorService
  ) { }

  getCategoryList() {
    return this._http.get(`${environment.apiUrl}/category`)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  getCategorizedBlogCount(bloggerId = 'all',status?: string) {
    let url = `${environment.apiUrl}/category/categorizedBlogs/${bloggerId}`;
    if (status) {
      url += `?status=${status}`;
    }
  
    return this._http.get(url)
      .pipe(
        catchError(err => this._errorService.handleError(err))
      );
  }
}
