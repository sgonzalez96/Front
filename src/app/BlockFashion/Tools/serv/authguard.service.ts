import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private logser: LoginService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


    if (this.logser.isAuthenticated()) {
      //console.log('VALE ' + this.logser.isAuthenticated())
      return true;
    }

    //console.log('CHAUUUU');
    this.router.navigate(['/login/logppal']);
    return false;
    
   //return true;
  }
}
