import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { BlogComponent } from './blog/blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'profile/:bloggerId', component: ProfileComponent },
  { path: 'profile/:bloggerId/:categoryId', component: ProfileComponent },
  {
    path: 'profile_edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'all_blogs/:categoryId',
    component: AllBlogsComponent,
  },
  {
    path: 'all_blogs',
    component: AllBlogsComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'write_blog',
    component: WriteBlogComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'blog/:blogId',
    component: BlogComponent
  },

  { path: 'edit-blog/:id', component: EditBlogComponent }

];
