import { Routes } from '@angular/router';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StoreComponent } from './components/store/store.component';
import { DetailComponent } from './components/detail/detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminGuard } from './services/adminGuardService';

export const routes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LandingPageComponent, },
    { path: 'dashboard', component: DashboardComponent,canActivate: [AdminGuard]  },
    { path: 'store', component: StoreComponent},
    { path : 'checkout', component:CheckoutComponent},
    { path: 'store/detail', component: DetailComponent },
    { path: 'login', component:LoginComponent},
    { path: 'register', component:RegisterComponent}
];