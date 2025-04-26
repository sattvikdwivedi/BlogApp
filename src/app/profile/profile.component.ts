import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UserProfile } from '../interfaces/user-profile';
import { AllBlogsModel } from '../interfaces/all-blogs-model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryComponentComponent } from '../common/category/category.component';
import {  ToastrService  } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CategoryComponentComponent,

  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  User: Observable<User> | undefined;
  categoryId: string = 'all';
  bloggerProfile: UserProfile = {
    sub: null,
    error: null,
    loading: null,
    data: {
        img: null,
        _id: null,
        email: null,
        first_name: null,
        last_name: null,
        role: null,
        joined: null,
        job: null,
        address: null,
        about: null
    }
  };

  bloggerAllBlogs: AllBlogsModel = {
    sub: null,
    error: null,
    loading: false,
    items: [],
    totalBlogs: 0,
    totalPages: [],
    currentPage: 0,
    status:''
  }
  
  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _blogService: BlogService,
    private toastr: ToastrService  ) { }
    
  ngOnInit(): void {

    this.User = this._authService.$User.pipe(
      filter((user): user is User => user !== null)
    );
    this.bloggerProfile.data._id = this._route.snapshot.paramMap.get('bloggerId');

    this._route.params.subscribe((params) => {
      if( !params['categoryId'] ) {
        this.categoryId = 'all';
      } else {
        this.categoryId = params['categoryId'];
      }
      this.getBloggerBlogs(this.bloggerProfile.data._id ?? '', this.categoryId);
    });

    if (this.bloggerProfile.data._id) {
      this.getBloggerProfile(this.bloggerProfile.data._id);
    }

  }

  getBloggerProfile(bloggerId: string) {
    this.User = this._authService.$User.pipe(
      filter((user): user is User => user !== null)
    );    this.bloggerProfile.loading = true;
    this.bloggerProfile.error = null;

    this.bloggerProfile.sub = this._authService.getBloggerProfile(bloggerId)
    .subscribe((res: any) => {

      this.bloggerProfile.data = res;
      this.bloggerProfile.data.img = this.bloggerProfile.data.img;
      this.bloggerProfile.loading = false;
      this.bloggerProfile.sub?.unsubscribe();
      
    }, err => {
      
      console.log(err);
      this.bloggerProfile.error = err;
      this.bloggerProfile.loading = false;
      this.bloggerProfile.sub?.unsubscribe();

    });

  }

  getBloggerBlogs(bloggerId: string, categoryId: string) {

    this.bloggerAllBlogs.loading = true;
    this.bloggerAllBlogs.error = null;
    
    this.bloggerAllBlogs.sub = this._blogService.getblogList(bloggerId, categoryId)
    .subscribe((res:any) => {

      this.bloggerAllBlogs.items = res.result;
      this.bloggerAllBlogs.totalBlogs = res.totalBlogs;
      this.bloggerAllBlogs.currentPage = res.currentPage;
      this.bloggerAllBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

      this.bloggerAllBlogs.loading = false;
      this.bloggerAllBlogs.sub?.unsubscribe();


    }, err => {
      
      this.bloggerAllBlogs.error = err;
      this.bloggerAllBlogs.loading = false;
      this.bloggerAllBlogs.sub?.unsubscribe();

    });

  }

  changePage(page:any) {

    this.bloggerAllBlogs.loading = true;
    this.bloggerAllBlogs.error = null;
    
    const bloggerId = this.bloggerProfile.data._id ?? '';
    this.bloggerAllBlogs.sub = this._blogService.getblogList(bloggerId, this.categoryId, page)
    .subscribe((res:any) => {

      this.bloggerAllBlogs.items = res.result;
      this.bloggerAllBlogs.totalBlogs = res.totalBlogs;
      this.bloggerAllBlogs.currentPage = res.currentPage;
      this.bloggerAllBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

      this.bloggerAllBlogs.loading = false;
      this.bloggerAllBlogs.sub?.unsubscribe();

    }, err => {
      
      this.bloggerAllBlogs.error = err;
      this.bloggerAllBlogs.loading = false;
      this.bloggerAllBlogs.sub?.unsubscribe();

    });

  }
  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this._blogService.deleteBlogAsAdmin(blogId).subscribe({
        next: (res) => {
          // Successfully deleted
          alert("Blog Deleled successfully")
          this.toastr.success('Blog deleted successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true
          });
          this.getBloggerBlogs(this.bloggerProfile.data._id ?? '', this.categoryId); // Refresh blogs
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete blog. Please try again.');
        }
      });
    }
  }
  

}
