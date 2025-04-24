import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { AllBlogsModel } from '../interfaces/all-blogs-model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryComponentComponent } from '../category/category.component';

@Component({
  selector: 'app-all-blogs',
  imports: [CommonModule, FormsModule,RouterModule ,CategoryComponentComponent],
  standalone:true,
  templateUrl: './all-blogs.component.html',
  styleUrl: './all-blogs.component.css'
})
export class AllBlogsComponent implements OnInit {

  apiUrl: any;
  allBlogs: AllBlogsModel = {
    sub: null,
    error: null,
    loading: false,
    items: [],
    totalBlogs: 0,
    totalPages: [],
    currentPage: 0
  }

  currentCategoryId: string = 'all';
  
  constructor(
    private _blogService: BlogService,
    private _route: ActivatedRoute
    ) { }
    
  ngOnInit(): void {
      
      this._route.params.subscribe((params) => {
        if( !params['categoryId'] ) {
          this.currentCategoryId = 'all';
          this.getAllBlogs();
        } else {
          this.currentCategoryId = params['categoryId'];
          this.getAllBlogs();
        }
      });

  }

  getAllBlogs() {

    this.allBlogs.loading = true;
    this.allBlogs.error = null;
    
    this.allBlogs.sub = this._blogService.getblogList('all', this.currentCategoryId)
    .subscribe((res:any) => {

      this.allBlogs.items = res.result;
      this.allBlogs.totalBlogs = res.totalBlogs;
      this.allBlogs.currentPage = res.currentPage;
      this.allBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

      this.allBlogs.loading = false;
      this.allBlogs.sub?.unsubscribe();

    }, err => {
      
      this.allBlogs.error = err;
      this.allBlogs.loading = false;
      this.allBlogs.sub?.unsubscribe();

    })
  }

  changePage(page:any) {

    this.allBlogs.loading = true;
    this.allBlogs.error = null;

    this._blogService.getblogList('all', this.currentCategoryId, page)
    .subscribe((res:any) => {

      this.allBlogs.items = res.result;
      this.allBlogs.totalBlogs = res.totalBlogs;
      this.allBlogs.currentPage = res.currentPage;
      this.allBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

      this.allBlogs.loading = false;
      this.allBlogs.sub?.unsubscribe();

    }, err => {
      
      this.allBlogs.error = err;
      this.allBlogs.loading = false;
      this.allBlogs.sub?.unsubscribe();

    })
  }

}
