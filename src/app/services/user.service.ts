import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/auth-user.model";
import { User } from "src/app/models/user.model";

interface UserResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        username: string,
        admin: boolean,
        enabled: boolean,
        name: string,
        email: string,
        created_ts: number,
        last_modified_ts: number
    }
}

@Injectable({providedIn: "root"})
export class UserService {
    // BehaviorSubject is a type of Subject, and therefore a type of Observable, which
    // allows us not only to subscribe to it whenever a new value of the user object
    // is available but also to get the current value even if we subscribed after that
    // value was set.
    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.authUser.subscribe(
            (u: AuthUser | null) => {
                if (u) {
                    // Get the user data from the API. The Access Token is automatically added as a
                    // header to to the request before sending it by the AuthInterceptor service.
                    const url = environment.notelist_api_url + "/users/user/" + u.user_id;
                    const request = this.http.get<UserResponseData>(url);

                    request.subscribe(
                        (d: UserResponseData) => this.user.next(new User(
                            d.result.id,
                            d.result.username,
                            d.result.admin,
                            d.result.enabled,
                            d.result.name,
                            d.result.email,
                            d.result.created_ts,
                            d.result.last_modified_ts
                        )),

                        (e: any) => this.authService.handleError(request, e)
                    )
                } else {
                    // If the current value of "authUser" is "null", it means no user is logged in
                    this.user.next(null);
                }
            },
        );
    }
}
