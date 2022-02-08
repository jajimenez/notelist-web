import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { User } from "src/app/models/user.model";

interface UserResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        username: string,
        admin: boolean,
        enabled: boolean,
        name: string | null,
        email: string | null,
        created: string | null,
        last_modified: string | null
    }
}

@Injectable({providedIn: "root"})
export class UserService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    // Return the current user
    getUser(): Observable<User> {
        if (!this.authService.authUser) return throwError(() => new Error("No user logged in"));

        const url = environment.notelistApiUrl + "/users/user/" + this.authService.authUser.userId;
        const request = this.http.get<UserResponseData>(url);

        return request.pipe(
            map((d: UserResponseData) => new User(
                d.result.id,
                d.result.username,
                d.result.admin,
                d.result.enabled,
                d.result.name,
                d.result.email,
                d.result.created,
                d.result.last_modified
            )),
            catchError(e => this.authService.handleError(request, e))
        );
    }
}
