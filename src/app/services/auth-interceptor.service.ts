import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // If the URL is the Login one or the current user is "null", we
        // return the original request without modifying it.
        const u = this.authService.authUser;
        if (req.url.endsWith("/auth/login") || !u) return next.handle(req);

        // Modify the request to include the Authorization header with the access or refresh token
        const token = req.url.endsWith("/auth/refresh") ? u.refreshToken : u.accessToken;
        const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
        const modReq = req.clone({headers: headers});

        return next.handle(modReq);
    }
}
