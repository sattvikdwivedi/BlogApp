import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  blogs: any[] = [];
  loading: boolean = false;
  error: string = '';
  user:any=''

  constructor(private _blogService: BlogService, private _router: Router,_authService:AuthService) {
    _authService.fetchUserData().subscribe({
      next: (userData: any) => {
      this.user = userData;
      console.log(this.user, "User data fetched successfully");
      },
      error: (err: any) => {
      console.error("Error fetching user data", err);
      }
    });
  }

  ngOnInit(): void {
    this.fetchAllBlogs();
    
  }

  fetchAllBlogs() {
    this.loading = true;
    this.error = '';
    const user_id= this.user;
    console.log(this.user,"hjsdbhsadf");
    this._blogService.getblogList(user_id, 'all').subscribe({
      next: (res: any) => {
        this.blogs = res.result;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading blogs';
        this.loading = false;
      }
    });
  }

  editBlog(blogId: string) {
    this._router.navigate(['/edit-blog', blogId]);
  }

  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this._blogService.deleteBlogAsAdmin(blogId).subscribe(() => {
        this.fetchAllBlogs(); // Refresh the list
      });
    }
  }

  viewBlog(blogId: string) {
    this._router.navigate(['/blog', blogId]);
  }
}
