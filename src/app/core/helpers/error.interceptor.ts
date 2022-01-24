import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            switch (err.status) {
                case 400:
                    Swal.close();
                    this.router.navigate(['/error-http',400]);
                    break;
                case 401:
                    Swal.close();
                    this.router.navigate(['/error-http',401]);
                    break;
                case 404:
                    Swal.close();
                    this.router.navigate(['/error-http',404]);
                    break;
                case 500:
                    Swal.close();
                    this.router.navigate(['/error-http',500]);
                    break;
            
                default:
                    break;
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}