import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CategoryService } from '../services/category.service';
import { UtilsService } from '../services/utils.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-blog',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})

export class EditBlogComponent implements OnInit {
  blogId: string = '';
  
  blog: any = {
    loading: false,
    error: null,
    data: {
      title: '',
      category: '',
      body: '',
      img: '',
      _id: ''
    }
  };

  categoryList: any = {
    loading: false,
    error: null,
    items: []
  };

  imageFile: File | null = null;
  apiUrl = environment.apiUrl;
  canEditOrDelete: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private authService: AuthService,


  ) { }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch the blog details
    this.blogService.getBlogById(this.blogId).subscribe(blog => {
      this.blog = blog;

      // Check if the current user can edit or delete the blog
      this.canEditOrDelete = this.authService.canEditOrDelete(blog.writter._id);
    });
    this.getBlogDetails();
    this.getCategories();
  }

  getBlogDetails(): void {
    this.blog.loading = true;
    this.blog.error = null;
    
    this.blogService.getBlogDetails(this.blogId).subscribe(
      (res: any) => {
        this.blog.data = res;
        if (res.img) {
          this.blog.data.img = `${this.apiUrl}/${res.img}`;
        }
        this.blog.loading = false;
      },
      (err) => {
        this.blog.error = err.message || 'Failed to load blog';
        this.blog.loading = false;
      }
    );
  }

  getCategories(): void {
    this.categoryList.loading = true;
    this.categoryList.error = null;
    
    this.categoryService.getCategoryList().subscribe(
      (res: any) => {
        this.categoryList.items = res;
        this.categoryList.loading = false;
      },
      (err) => {
        this.categoryList.error = err.message || 'Failed to load categories';
        this.categoryList.loading = false;
      }
    );
  }

  updateBlog(form: any): void {
    if (form.invalid) return;

    this.blog.loading = true;
    this.blog.error = null;

    const formData = new FormData();
    formData.append('title', this.blog.data.title);
    formData.append('category', this.blog.data.category);
    formData.append('body', this.blog.data.body);

    this.blogService.updateBlog(this.blogId, formData).subscribe(
      (res: any) => {
        this.router.navigate(['/blog', res._id]);
      },
      (err) => {
        this.blog.error = err.message || 'Failed to update blog';
        this.blog.loading = false;
      }
    );
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.blog.data.img = reader.result as string;
      };
      if (this.imageFile) {
        reader.readAsDataURL(this.imageFile);
      }
    }
  }

  getImageUrl(): string {
    if (this.blog.data.img && this.blog.data.img.startsWith('data:')) {
      return this.blog.data.img;
    }
    return this.blog.data.img ? `${this.apiUrl}/${this.blog.data.img}` : '';
  }
}
