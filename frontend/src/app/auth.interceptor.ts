import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next:HttpHandler){
        const accessToken = this.authService.getAccessToken();

        request = request.clone({
            setHeaders: {
                Authorization: `JWT ${accessToken}`
            }
        });

        return next.handle(request);
    }
}