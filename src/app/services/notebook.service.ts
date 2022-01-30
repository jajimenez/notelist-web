import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

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
                if (u) {
                    // Get the notebook list data from the API. The Access Token is automatically added
                    // as a header to to the request before sending it by the AuthInterceptor service.
                    const url = environment.notelist_api_url + "/notebooks/notebooks";
                    const request = this.http.get<NotebookListResponseData>(url);

                    request.subscribe(
                        (d: NotebookListResponseData) => this.notebooks.next(d.result.map(
                            (x) => new Notebook(x.id, x.name, x.created_ts, x.last_modified_ts)
                        )),

                        (e: any) => this.authService.handleError(request, e)
                    );
                } else {
                    // If the current value of "authUser" is "null", it means no user is logged in
                    this.notebooks.next([]);
                }
            }
        );

        this.notebooks.subscribe(
            (n: Notebook[]) => {
                if (n.length === 0) this.currentNotebook.next(null);
                else this.currentNotebook.next(n[0]);
            }
        )
    }
}
