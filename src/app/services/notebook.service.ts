import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/auth-user.model";
import { Notebook } from "src/app/models/notebook.model";

interface NotebookListResponseData {
    message: string,
    message_type: string,
    result: [
        {
            id: string,
            name: string,
            created_ts: number,
            last_modified_ts: number
        }
    ]
}

interface ResponseData {
    message: string,
    message_type: string
}

@Injectable({providedIn: "root"})
export class NotebookService {
    // BehaviorSubject is a type of Subject, and therefore a type of Observable, which
    // allows us not only to subscribe to it whenever a new value of the user object
    // is available but also to get the current value even if we subscribed after that
    // value was set.
    notebooks = new BehaviorSubject<Notebook[]>([]);
    currentNotebook = new BehaviorSubject<Notebook | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.authUser.subscribe(
            (u: AuthUser | null) => {
                // If the current value of "authUser" is "null", it means no user is logged in
                if (u) this.load()
                else this.notebooks.next([]);
            }
        );

        this.notebooks.subscribe(
            (n: Notebook[]) => {
                if (n.length === 0) this.currentNotebook.next(null);
                else this.currentNotebook.next(n[0]);
            }
        )
    }

    load() {
        // Get the notebook list data from the API. The Access Token is automatically added
        // as a header to to the request before sending it by the AuthInterceptor service.
        const url = environment.notelist_api_url + "/notebooks/notebooks";
        const request = this.http.get<NotebookListResponseData>(url);

        request.subscribe({
            next: (d: NotebookListResponseData) => this.notebooks.next(d.result.map(
                (x) => new Notebook(x.id, x.name, x.created_ts, x.last_modified_ts)
            )),
            error: (e: any) => this.authService.handleError(request, e)
        });
    }

    create(name: string): Observable<void> {
        const url = environment.notelist_api_url + "/notebooks/notebook";
        const data = {name: name};

        return this.http.post<ResponseData>(url, data).pipe(
            map((d: ResponseData) => {}),
            tap(() => this.load()),
            catchError(errorResponse => {
                // Replace the error response by its "error.message" property if it exists or
                // by "Unknown error" otherwise.

                if (!errorResponse.error || !errorResponse.error.message) {
                    return throwError(() => new Error("Unknown error"));
                }

                return throwError(() => new Error(errorResponse.error.message));
            })
        );
    }
}
