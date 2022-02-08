import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({providedIn: "root"})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Return "true" if there is a user logged in or the URL to redirect to otherwise
        const rootPath = "/";
        const loginPath = "/login";
        const u = this.authService.authUser;

        if (!u && !state.url.endsWith(loginPath)) return this.router.createUrlTree([loginPath]);
        if (u && state.url.endsWith(loginPath)) return this.router.createUrlTree([rootPath]);

        return true;
    }
}
