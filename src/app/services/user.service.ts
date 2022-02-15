import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { AuthUser } from "../models/auth-user.model";
import { User } from "src/app/models/user.model";

interface UserResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        username: string,
        admin: boolean,
        enabled: boolean,
        name: string | undefined,
        email: string | undefined,
        created: string | undefined,
        last_modified: string | undefined
    }
}

@Injectable({providedIn: "root"})
export class UserService {
    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.authUser.subscribe({
            next: (au: AuthUser | null) => this.updateUser(au)
        });
    }

    // Update the current user
    private updateUser(au: AuthUser | null) {
        if (au) {
            this.getUser(au.userId).subscribe({
                next: (u: User) => this.user.next(u)
            });
        } else {
            this.user.next(null);
        }
    }

    // Return a given user
    private getUser(id: string): Observable<User> {
        const url = environment.notelistApiUrl + "/users/user/" + id;
        const request = this.http.get<UserResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),

            map((d: UserResponseData) => new User(
                d.result.id,
                d.result.username,
                d.result.admin,
                d.result.enabled,
                d.result.name,
                d.result.email,
                d.result.created,
                d.result.last_modified
            ))
        );
    }
}
