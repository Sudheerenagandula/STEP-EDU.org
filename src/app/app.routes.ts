import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { About } from './components/about/about';
import { CoursesComponent } from './components/courses/courses';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { ContactComponent } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'about', component: About },
  { path: 'courses', component: CoursesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
