import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router'; // 🆕 Router added
import { AllBlogsModel } from '../interfaces/all-blogs-model';
import { CategoryComponentComponent } from '../common/category/category.component';
import { AuthService } from '../services/auth.service'; // 🆕 AuthService added
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-all-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CategoryComponentComponent],
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.css']
})
export class AllBlogsComponent implements OnInit {
  apiUrl: any;
  isAdmin: boolean = false;
  
  allBlogs: AllBlogsModel = {
    sub: null,
    error: null,
    loading: false,
    items: [],
    totalBlogs: 0,
    totalPages: [],
    currentPage: 0,
    status:"",
  }
  
  categories: any[] = [];
  publishedBlogs: any[] = [];
  currentCategoryId: string = 'all';
  currentUserId: string = ''
  
  constructor(
    private _blogService: BlogService,
    private _authService: AuthService, 
    private _router: Router,           
    private _route: ActivatedRoute,
    private _categoryService: CategoryService,
  ) {}
  
  ngOnInit(): void {
    const user = this._authService.$User.getValue();
    this.isAdmin = user?.role === 'admin';
    this.currentUserId = user?._id || '';
    
    this._route.params.subscribe((params) => {
      this.currentCategoryId = params['categoryId'] || 'all';
      this.getAllBlogs(1);
    });
  }
  

  
  getAllBlogs(page: number = 1) {
    this.allBlogs.loading = true;
    this.allBlogs.error = null;
  
    this.allBlogs.sub = this._blogService.getblogList('all', 'all', page,'Published')
      .subscribe((res: any) => {
        this.allBlogs.items = res.result;
        this.allBlogs.totalBlogs = res.totalBlogs;
        this.allBlogs.currentPage = res.currentPage;
        this.allBlogs.totalPages = Array.from({ length: res.totalPages }, (_, i) => i + 1); // Correct way
        this.allBlogs.status = res.status;
        this.publishedBlogs = this.allBlogs.items.filter(blog => blog.status === 'Published');
        console.log(this.publishedBlogs,"fdsnjdfsdfsfd")
  
        this.allBlogs.loading = false;
        this.allBlogs.sub?.unsubscribe();
      }, err => {
        this.allBlogs.error = err;
        this.allBlogs.loading = false;
        this.allBlogs.sub?.unsubscribe();
      });
  }

  changePage(page: number) {
    if (page !== this.allBlogs.currentPage) {
      this.getAllBlogs(page);
    }
  }
  

  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this._blogService.deleteBlogAsAdmin(blogId).subscribe(async () => {
        await this.getAllBlogs(); // reload list
        this.getCategoryList();
      });
    }
  }

  editBlog(blogId: string) {
    this._router.navigate(['/edit-blog', blogId]); // make sure this route exists
  }

  viewBlog(blogId: string) {
    this._router.navigate(['/blog', blogId]);
  }

  getCategoryList() {
    this._categoryService.getCategoryList().subscribe((categories: any) => {
      this.categories = categories as any[]; // Cast the emitted value to any[]
    });
  }

  canEditOrDelete(blogOwnerId: string): boolean {
    return this.isAdmin || this.currentUserId === blogOwnerId;
  }
}