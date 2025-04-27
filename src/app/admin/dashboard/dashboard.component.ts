import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { CategoryComponentComponent } from '../../common/category/category.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'; // Import it globally (simple JS import)
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,CategoryComponentComponent,SweetAlert2Module],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  paginatedBlogs: any[] = [];
  loading: boolean = false;
  error: string = '';
  user: any = '';
  
  // Search filters
  searchTitle: string = '';
  searchAuthor: string = '';
  searchStatus: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  totalCount:number=1;
  prevpage:number=0;

  constructor(
    private _blogService: BlogService, 
    private _router: Router,
    private _authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._authService.fetchUserData().subscribe({
      next: (userData: any) => {
        this.user = userData;
        this.fetchAllBlogs();
      },
      error: (err: any) => {
        console.error("Error fetching user data", err);
      }
    });
  }

  fetchAllBlogs(page: number = 1) {
    this.loading = true;
    this.error = '';
    this._blogService.getblogList("all", "all", page).subscribe({
      next: (res: any) => {
        this.blogs = res.result; // Already current page blogs
        this.totalCount = res.totalBlogs;
        this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
        this.currentPage = res.currentPage; // Backend sends it
  
        this.paginatedBlogs = this.blogs; // No slicing needed
        this.loading = false;
        this.filterBlogs();
      },
      error: (err: any) => {
        this.error = 'Error loading blogs';
        this.loading = false;
      }
    });
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchAllBlogs(page); // Directly fetch the page
    }
  }
  

  filterBlogs() {
    this.filteredBlogs = this.blogs.filter(blog => {
      const matchesTitle = blog.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesAuthor = blog.writter.first_name.toLowerCase().includes(this.searchAuthor.toLowerCase());
      const matchesStatus = this.searchStatus ? blog.status === this.searchStatus : true;
      return matchesTitle && matchesAuthor && matchesStatus;
    });

    this.paginatedBlogs = this.filteredBlogs; // No slicing needed

    
  }

  

 

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  editBlog(blogId: string) {
    this._router.navigate(['/edit-blog', blogId]);
  }

  deleteBlog(blogId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        this._blogService.deleteBlogAsAdmin(blogId).subscribe({
          next: () => {
            Swal.close(); // Close the "Deleting..." loading popup
            this.fetchAllBlogs(); // Refresh the blog list
            this.toastr.success('Blog deleted successfully!', 'Success');
          },
          error: (err) => {
            Swal.close(); // Close the loading popup on error
            this.toastr.error('Failed to delete the blog. Please try again.', 'Error');
            console.error(err);
          }
        });
      }
    });
  }
  



  viewBlog(blogId: string) {
    this._router.navigate(['/blog', blogId]);
  }
}