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
import {  ToastrService  } from 'ngx-toastr';
import Swal from 'sweetalert2'; // Import it globally (simple JS import)
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,SweetAlert2Module
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

  // Variables
previewImg: string | ArrayBuffer | null = null;
selectedFile: File | null = null;

// Function to handle image selection
onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImg = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Function to upload the selected image
uploadProfileImage() {
  if (!this.selectedFile) return;
  const userId = this.bloggerProfile.data._id;  // get user's id

  // Call your service (change this._authService to your real service name)
  if (!userId) {
    console.error('User ID is null or undefined.');
    return;
  }
  this._authService.uploadProfilePicture(this.selectedFile, userId).subscribe({
    next: (res) => {
      alert('Profile picture updated successfully!');
      this.previewImg = null;
      this.selectedFile = null;
      this.bloggerProfile.data.img = res.img; // Assuming server returns updated image URL
    },
    error: (err) => {
      console.error('Error uploading image', err);
      alert('Failed to upload image.');
    }
  });
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

  // getBloggerBlogs(bloggerId: string, categoryId: string) {

  //   this.bloggerAllBlogs.loading = true;
  //   this.bloggerAllBlogs.error = null;
    
  //   this.bloggerAllBlogs.sub = this._blogService.getblogList(bloggerId, categoryId)
  //   .subscribe((res:any) => {

  //     this.bloggerAllBlogs.items = res.result;
  //     this.bloggerAllBlogs.totalBlogs = res.totalBlogs;
  //     this.bloggerAllBlogs.currentPage = res.currentPage;
  //     this.bloggerAllBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

  //     this.bloggerAllBlogs.loading = false;
  //     this.bloggerAllBlogs.sub?.unsubscribe();


  //   }, err => {
      
  //     this.bloggerAllBlogs.error = err;
  //     this.bloggerAllBlogs.loading = false;
  //     this.bloggerAllBlogs.sub?.unsubscribe();

  //   });

  // }

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
          next: (res) => {
            Swal.close(); // Close the loading popup
            this.toastr.success('Blog deleted successfully!', 'Success');
            this.getBloggerBlogs(this.bloggerProfile.data._id ?? '', this.categoryId);
          },
          error: (err) => {
            Swal.close(); // Close the loading popup
            this.toastr.error('Failed to delete blog. Please try again.', 'Error');
          }
        });
      }
    });
  }
  // Add these properties to your component class
selectedStatus: string = 'all';
filteredBlogs: any[] = [];

// Add this method to filter blogs by status
filterBlogsByStatus() {
  if (this.selectedStatus === 'all') {
    this.filteredBlogs = [...this.bloggerAllBlogs.items];
  } else {
    this.filteredBlogs = this.bloggerAllBlogs.items.filter(
      blog => blog.status === this.selectedStatus
    );
  }
}

// Update your getBloggerBlogs method to initialize filteredBlogs
getBloggerBlogs(bloggerId: string, categoryId: string) {
  this.bloggerAllBlogs.loading = true;
  this.bloggerAllBlogs.error = null;
  console.log(this._blogService.getblogList(bloggerId, categoryId),"all")

  this.bloggerAllBlogs.sub = this._blogService.getblogList(bloggerId, categoryId)
  .subscribe((res:any) => {
    this.bloggerAllBlogs.items = res.result;
    this.filteredBlogs = [...res.result]; // Initialize filtered blogs
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

  // getBloggerBlogs(bloggerId: string, categoryId: string) {

  //   this.bloggerAllBlogs.loading = true;
  //   this.bloggerAllBlogs.error = null;
    
  //   this.bloggerAllBlogs.sub = this._blogService.getblogList(bloggerId, categoryId)
  //   .subscribe((res:any) => {

  //     this.bloggerAllBlogs.items = res.result;
  //     this.bloggerAllBlogs.totalBlogs = res.totalBlogs;
  //     this.bloggerAllBlogs.currentPage = res.currentPage;
  //     this.bloggerAllBlogs.totalPages = Array(res.totalPages).fill(5).map((x,i)=>i);

  //     this.bloggerAllBlogs.loading = false;
  //     this.bloggerAllBlogs.sub?.unsubscribe();


  //   }, err => {
      
  //     this.bloggerAllBlogs.error = err;
  //     this.bloggerAllBlogs.loading = false;
  //     this.bloggerAllBlogs.sub?.unsubscribe();

  //   });

  // }
  

}
