import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { CartService } from './services/cartservice.service';
import { UserService } from './services/userService';
import { routes } from './app.routes';
import { AdminGuard } from './services/adminGuardService';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),provideAnimations(),CartService,UserService,AdminGuard]
};
