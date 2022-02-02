import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AuthUser } from "src/app/models/auth-user.model";

@Injectable({providedIn: "root"})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Return "true" if there is a user logged in or the URL to redirect to otherwise
        return this.authService.authUser.pipe(
            take(1),  // Get the current value (AuthUser instance) of the "authUser" observable
            map((u: AuthUser | null) => {
                if (u === null && !state.url.endsWith("/login")) return this.router.createUrlTree(["/login"]);
                if (u !== null && state.url.endsWith("/login")) return this.router.createUrlTree(["/notebooks"]);

                return true;
            })
        )
    }
}
