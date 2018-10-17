import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

// for routing, only if someone is logged in app-routing canActivate ist true
  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
