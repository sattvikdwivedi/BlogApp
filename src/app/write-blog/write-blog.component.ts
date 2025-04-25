import { Component, OnInit } from '@angular/core';
import { CategoryList } from '../interfaces/category-list';
import { WriteBlog } from '../interfaces/write-blog';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-write-blog',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './write-blog.component.html',
  styleUrl: './write-blog.component.css'
})

export class WriteBlogComponent implements OnInit {

  apiUrl:any;
  categoryList: CategoryList = {
    sub: null,
    error: null,
    loading: false,
    items: []
  };
  
  blog: WriteBlog = {
    sub: null,
    error: null,
    loading: false,
    data: {
        title: null,
        category: null,
        body: null,
        img: ''
    }
  };

  image:any;

  constructor(
    private _authService: AuthService,
    private _categorySerice: CategoryService,
    private _blogService: BlogService,
    private _router: Router,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  saveBlog() {
    this.blog.loading = true;
    this.blog.error = null;

    this.blog.data = this._utils.trimObject(this.blog.data);
    const formData = new FormData();
    formData.append('title', this.blog.data.title || '');
    formData.append('category', this.blog.data.category || '');
    formData.append('body', this.blog.data.body || '');
    if( this.image ) {
      formData.append('img', this.image);
    }
    
    this.blog.sub = this._blogService.writeBlog(formData)
    .subscribe((res:any) => {

      this._router.navigate(['/blog', res._id])
      this.blog.loading = false;
      this.blog.sub?.unsubscribe();
      
    }, err => {
      
      this.blog.error = err;
      this.blog.loading = false;
      this.blog.sub?.unsubscribe();

    })
  }

  getCategories() {
    this.categoryList.loading = true;
    this.categoryList.error = null;
    
    this.categoryList.sub = this._categorySerice.getCategoryList()
    .subscribe((res: any) => {
      
      this.categoryList.items = res;
      this.categoryList.loading = false;
      this.categoryList.sub?.unsubscribe();

    }, err => {

      this.categoryList.error = err;
      this.categoryList.loading = false;
      this.categoryList.sub?.unsubscribe();

    })
  }

  fileChangeEvent(e:any) {
    if( e.target.files.length > 0 ) {
      this.image = e.target.files[0];
      
      const target = e.target as HTMLInputElement;
      const file = target?.files ? target.files[0] : null;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.blog.data.img = reader.result as string;
      }
      reader.readAsDataURL(file)

    }
  }

}
