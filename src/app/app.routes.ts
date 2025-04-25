import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'profile/:bloggerId', component: ProfileComponent },
  { path: 'profile/:bloggerId/:categoryId', component: ProfileComponent },
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
    component: ContactComponent
  }
  ,
  {
    path: 'profile_edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard]
  },
  
];
