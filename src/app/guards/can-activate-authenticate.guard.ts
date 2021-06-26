import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Router } from '@angular/router';
import { LsService } from '../services/ls/ls.service';
@Injectable()
export class CanActivateAuthenticateGuard implements CanActivate {

  routes = ['/', '/auth/login', '/auth/register', '/auth/verification'];

  constructor(
    private lsService: LsService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isUnprotectedRoute = false;
    if (
      this.routes.indexOf(state.url) !== -1) {
      isUnprotectedRoute = true;
    }
    if (this.lsService.getValue('isLoggedIn') && isUnprotectedRoute) {
      this.router.navigate(['/tasks/today']);
    } else if (this.lsService.getValue('isLoggedIn') && !isUnprotectedRoute) {
      return true;
    } else if (!this.lsService.getValue('isLoggedIn') && !isUnprotectedRoute) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
