import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs"
import { take, map, exhaustMap, tap, catchError } from "rxjs/operators";

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
    // BehaviorSubject is a type of Subject, and therefore a type of Observable, which
    // allows us not only to subscribe to it whenever a new value of the user object
    // is available but also to get the current value even if we subscribed after that
    // value was set.
    authUser = new BehaviorSubject<AuthUser | null>(null);

    constructor(private http: HttpClient, private router: Router) {}

    autoLogin() {
        const authUserVal = localStorage.getItem("auth-user");
        if (!authUserVal) return;
        const authUserData: AuthUser = JSON.parse(authUserVal);
        this.authUser.next(authUserData);
    }

    login(username: string, password: string): Observable<AuthUser> {
        const url = environment.notelist_api_url + "/auth/login";
        const data = {username: username, password: password};

        return this.http.post<LoginResponseData>(url, data).pipe(
            // Replace the error response by its "error.message" property if it exists or
            // by "Unknown error" otherwise.
            catchError(errorResponse => {
                if (!errorResponse.error || !errorResponse.error.message) {
                    return throwError(() => new Error("Unknown error"));
                }

                return throwError(() => new Error(errorResponse.error.message));
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
                this.authUser.next(u)
                this.router.navigate(["/"]);
            })
        );
    }

    refreshLogin(): Observable<AuthUser> {
        return this.authUser.pipe(
            take(1),

            exhaustMap((u: AuthUser | null) => {
                if (!u || !u.refresh_token) return throwError(() => new Error("No user logged in"));
                const url = environment.notelist_api_url + "/auth/refresh";

                return this.http.get<RefreshResponseData>(url).pipe(
                    catchError(errorResponse => {
                        // If the refresh token is expired or not valid, or other error
                        // occurred, we log out.
                        this.uiLogout();
                        
                        // Replace the error response by its "error.message" property if
                        // it exists or by "Unknown error" otherwise.
                        if (!errorResponse.error || !errorResponse.error.message) {
                            return throwError(() => new Error("Unknown error"));
                        }
        
                        return throwError(() => new Error(errorResponse.error.message));
                    }),

                    // Convert the response data to an AuthUser object
                    map((d: RefreshResponseData) => new AuthUser(
                        d.result.access_token,
                        u.refresh_token,
                        u.user_id
                    )),

                    // Save the user to the Local Storage in order to recover it in
                    // case the application is reloaded. Notify about the user logged
                    // in and redirect to the root route.
                    tap((u: AuthUser) => {
                        localStorage.setItem("auth-user", JSON.stringify(u))
                        this.authUser.next(u);
                    })
                );
            })
        );
    }

    private uiLogout() {
        // Remove the user from the Local Storage, notify that no user is logged in and
        // redirect to the Login route.
        localStorage.removeItem("auth-user")
        this.authUser.next(null);
        this.router.navigate(["/login"]);
    }

    logout(): Observable<void> {
        const url = environment.notelist_api_url + "/auth/logout";

        return this.http.get<LogoutResponseData>(url).pipe(
            map((d: LogoutResponseData) => {}),
            tap(() => this.uiLogout()),
            catchError(errorResponse => {
                this.uiLogout();

                // Replace the error response by its "error.message" property if it
                // exists or by "Unknown error" otherwise.
                if (!errorResponse.error || !errorResponse.error.message) {
                    return throwError(() => new Error("Unknown error"));
                }

                return throwError(() => new Error(errorResponse.error.message));
            })
        );
    }

    handleError(request: Observable<any>, errorResponse: any): Observable<any> {
        if (!errorResponse.error || !errorResponse.error.message || !errorResponse.error.message_type) {
            return throwError(() => new Error("Unknown error"))
        }

        const message = errorResponse.error.message;
        const messageType = errorResponse.error.message_type;

        if (messageType === "error_expired_token") {
            // If the access token is expired, we refresh the token and return the original request.
            return this.refreshLogin().pipe(
                exhaustMap((u: AuthUser) => request)
            );
        } else if (messageType === "error_revoked_token") {
            // If the token is revoked, we log out.
            this.uiLogout();
        }

        return throwError(() => new Error(message));
    }
}
