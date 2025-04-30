import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesModel } from '../../interfaces/categories-model';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-category',
  standalone: true, // <-- only if you're using standalone components
  imports: [CommonModule, FormsModule,RouterModule],
templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponentComponent implements OnInit {

  @Input() categoryId!: string;
  @Input() bloggerName!: string;
  @Input() bloggerId?: any;
  @Input() status: string = 'all';     // default 'all'

  sectionTitle: string | undefined;
  categories: CategoriesModel = {
    sub: null,
    error: null,
    loading: false,
    items: [],
    totalBlogs: 0,
    currentCategoryId: 'all'
  }
  

  constructor(
    private _categoryService: CategoryService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    if( this.bloggerName ){
      this.sectionTitle = this.bloggerName + "'s";
    } else {
      this.sectionTitle = 'Blog'
    }

    if( !this.bloggerId ) {
      this.bloggerId = 'all';
    }

    if( !this.categoryId ) {
      this.categoryId = 'all';
    }

    this._route.params.subscribe((params) => {

      if( !params['categoryId'] ) {
        this.categories.currentCategoryId = 'all';
      } else {
        this.categories.currentCategoryId = params['categoryId'];
      }
    });

    this.getCategorizedBlogsCount();
  }

  getCategorizedBlogsCount() {
    this.categories.loading = true;
    this.categories.error = null;

    this.categories.sub = this._categoryService.getCategorizedBlogCount(this.bloggerId,this.status)
    .subscribe((res:any) => {

      this.categories.items = res;
      this.categories.items.forEach(c => {
        this.categories.totalBlogs += c.count;
      });
      this.categories.loading = false;
      this.categories.sub?.unsubscribe();

    }, err => {
      
      this.categories.error = err;
      this.categories.loading = false;
      this.categories.sub?.unsubscribe();

    })
  }

}
