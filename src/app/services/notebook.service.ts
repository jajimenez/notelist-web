import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
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
            created: string | null,
            last_modified: string | null
        }
    ]
}

@Injectable({providedIn: "root"})
export class NotebookService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    // Get the notebooks of the current user. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    getNotebooks(): Observable<Notebook[]> {
        const url = environment.notelistApiUrl + "/notebooks/notebooks";
        const request = this.http.get<NotebookListResponseData>(url);

        return request.pipe(
            map((d: NotebookListResponseData) => d.result.map((x) => new Notebook(x.id, x.name, x.created, x.last_modified))),
            catchError(e => this.authService.handleError(request, e))
        );
    }

    /*createNotebook(name: string) {
        // Create a notebook. The Access Token is automatically added as a header to the
        // request before sending it by the AuthInterceptor service.
        const url = environment.notelistApiUrl + "/notebooks/notebook";
        const data = {name: name};
        const request = this.http.post<ResponseData>(url, data);

        request.subscribe({
            next: (d: ResponseData) => this.loadNotebooks(),
            error: (e: any) => this.authService.handleError(request, e)
        })
    }*/
}
