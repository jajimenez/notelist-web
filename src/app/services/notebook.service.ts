import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { AuthUser } from "src/app/models/auth-user.model";
import { Notebook } from "src/app/models/notebook.model";

/*interface ResponseData {
    message: string,
    message_type: string
}*/

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

@Injectable({providedIn: "root"})
export class NotebookService {
    // BehaviorSubject is a type of Subject, and therefore a type of Observable, which
    // allows us not only to subscribe to it whenever a new value of the user object
    // is available but also to get the current value even if we subscribed after that
    // value was set.
    notebooks = new BehaviorSubject<Notebook[]>([]);

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.authUser.subscribe({
            next: (u: AuthUser | null) => {
                // If the current value of "authUser" is "null", it means no user is logged in
                if (u) this.loadNotebooks();
                else this.notebooks.next([]);
            },
            error: (e: any) => this.notebooks.next([])
        });
    }

    // Load the notebooks of the current user. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    private loadNotebooks() {
        const url = environment.notelist_api_url + "/notebooks/notebooks";
        const request = this.http.get<NotebookListResponseData>(url);

        request.pipe(
            map((d: NotebookListResponseData) => d.result.map((x) => new Notebook(x.id, x.name, x.created_ts, x.last_modified_ts))),
            catchError(e => this.authService.handleError(request, e))
        ).subscribe({
            next: (notebooks: Notebook[]) => this.notebooks.next(notebooks)
        });
    }

    /*createNotebook(name: string) {
        // Create a notebook. The Access Token is automatically added as a header to the
        // request before sending it by the AuthInterceptor service.
        const url = environment.notelist_api_url + "/notebooks/notebook";
        const data = {name: name};
        const request = this.http.post<ResponseData>(url, data);

        request.subscribe({
            next: (d: ResponseData) => this.loadNotebooks(),
            error: (e: any) => this.authService.handleError(request, e)
        })
    }*/
}
