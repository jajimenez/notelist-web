import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AuthUser } from "src/app/models/auth-user.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.authUser.pipe(
            // Get the current value (AuthUser instance) of the "authUser" observable
            take(1),

            // "exhaustMap" has an anonymous function as an argument (which has an argument
            // "u" that is the current value of the "authUser" observable) which returns an
            // observable (returned by "next.handle") which replaces the observable
            // returned by "pipe" and which is therefore returned by "intercept".
            exhaustMap((u: AuthUser | null) => {
                // If the URL is the Login one or the current user is "null", we
                // return the original request without modifying it.
                if (req.url.endsWith("/auth/login") || !u) return next.handle(req);

                // Modify the request to include the Authorization header with the access or refresh token
                const token = req.url.endsWith("/auth/refresh") ? u.refresh_token : u.access_token;
                const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
                const modReq = req.clone({headers: headers});

                return next.handle(modReq);
            })
        );
    }
}
