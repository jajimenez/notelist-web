import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs"
import { map, exhaustMap, tap, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthUser } from "src/app/models/auth-user.model";

interface LoginResponseData {
    message: string,
    message_type: string,
    result: {
        access_token: string,
        refresh_token: string,
        user_id: string
    }
}

interface RefreshResponseData {
    message: string,
    message_type: string,
    result: {
        access_token: string
    }
}

interface LogoutResponseData {
    message: string,
    message_type: string
}

@Injectable({providedIn: "root"})
export class AuthService {
    authUser = new BehaviorSubject<AuthUser| null>(null);

    constructor(private http: HttpClient, private router: Router) {}

    autoLogin() {
        const authUserVal = localStorage.getItem("auth-user");
        if (!authUserVal) return;

        const authUserData: AuthUser = JSON.parse(authUserVal);
        this.authUser.next(authUserData);
    }

    login(username: string, password: string): Observable<AuthUser> {
        const url = environment.notelistApiUrl + "/auth/login";
        const data = {username: username, password: password};

        return this.http.post<LoginResponseData>(url, data).pipe(
            // Replace the error response by its "error.message" property if it exists or
            // by "Unknown error" otherwise.
            catchError(e => {
                if (!e.error || !e.error.message) return throwError(() => new Error("Unknown error"));

                return throwError(() => new Error(e.error.message));
            }),

            // Convert the response data to an AuthUser object
            map((d: LoginResponseData) => new AuthUser(
                d.result.access_token,
                d.result.refresh_token,
                d.result.user_id
            )),

            // Save the user to the Local Storage in order to recover it in
            // case the application is reloaded. Notify about the user logged
            // in and redirect to the root route.
            tap((u: AuthUser) => {
                localStorage.setItem("auth-user", JSON.stringify(u))
                this.authUser.next(u);
                this.router.navigateByUrl("/");
            })
        );
    }

    private refreshLogin(): Observable<void> {
        const au = this.authUser.value;
        if (!au || !au.refreshToken || !au.userId) return throwError(() => new Error("No user logged in"));

        const url = environment.notelistApiUrl + "/auth/refresh";

        return this.http.get<RefreshResponseData>(url).pipe(
            catchError(e => {
                // If the refresh token is expired or not valid, or other error
                // occurred, we log out.
                this._logout();
                
                // Replace the error response by its "error.message" property if
                // it exists or by "Unknown error" otherwise.
                if (!e.error || !e.error.message) return throwError(() => new Error("Unknown error"));

                return throwError(() => new Error(e.error.message));
            }),

            // Convert the response data to an AuthUser object
            map((d: RefreshResponseData) => {
                return new AuthUser(d.result.access_token, au.refreshToken, au.userId);
            }),

            // Save the user to the Local Storage in order to recover it in
            // case the application is reloaded. Notify about the user logged
            // in and redirect to the root route.
            tap((u: AuthUser) => {
                localStorage.setItem("auth-user", JSON.stringify(u))
                this.authUser.next(u);
            }),

            map((d: AuthUser) => undefined)
        );
    }

    // Unset the user and redirect to the Login route
    private _logout() {
        localStorage.removeItem("auth-user")
        this.authUser.next(null);
        this.router.navigateByUrl("/login");
    }

    handleError(request: Observable<any>, e: any): Observable<any> {
        if (!e.error || !e.error.message || !e.error.message_type) {
            return throwError(() => new Error("Unknown error"))
        }

        const message = e.error.message;
        const messageType = e.error.message_type;

        if (messageType === "error_expired_token") {
            // If the access token is expired, we refresh the token and return the original request.
            return this.refreshLogin().pipe(
                exhaustMap(() => request)
            );
        } else if (messageType === "error_revoked_token") {
            // If the token is revoked, we log out.
            this._logout();
        }

        return throwError(() => new Error(message));
    }

    logout(): Observable<void> {
        const url = environment.notelistApiUrl + "/auth/logout";

        return this.http.get<LogoutResponseData>(url).pipe(
            catchError(e => {
                // If the refresh token is expired or not valid, or other error
                // occurred, we log out.
                this._logout();
                
                // Replace the error response by its "error.message" property if
                // it exists or by "Unknown error" otherwise.
                if (!e.error || !e.error.message) return throwError(() => new Error("Unknown error"));

                return throwError(() => new Error(e.error.message));
            }),
            map((d: LogoutResponseData) => undefined),
            tap(() => this._logout())
        );
    }
}
