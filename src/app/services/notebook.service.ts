import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/auth-user.model";
import { Notebook } from "src/app/models/notebook.model";
import { NotePreview } from "../models/note.model";

interface ResponseData {
    message: string,
    message_type: string
}

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

interface NoteListResponseData {
    message: string,
    message_type: string,
    result: [
        {
            id: string,
            title: string,
            tags: {name: string, color: string | null}[]
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
    currentNotebookNotes = new BehaviorSubject<NotePreview[]>([]);

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.authUser.subscribe({
            next: (u: AuthUser | null) => {
                // If the current value of "authUser" is "null", it means no user is logged in
                if (u) this.loadNotebooks();
                else this.notebooks.next([]);
            }
        });

        this.notebooks.subscribe({
            next: (notebooks: Notebook[]) => {
                if (notebooks.length === 0) this.currentNotebook.next(null);
                else this.currentNotebook.next(notebooks[0]);
            }
        })

        this.currentNotebook.subscribe({
            next: (n: Notebook | null) => {
                if (n) this.loadNotes();
                else this.currentNotebookNotes.next([]);
            }
        })
    }

    private loadNotebooks() {
        // Get the notebook list data from the API. The Access Token is automatically added
        // as a header to the request before sending it by the AuthInterceptor service.
        const url = environment.notelist_api_url + "/notebooks/notebooks";
        const request = this.http.get<NotebookListResponseData>(url);

        request.subscribe({
            next: (d: NotebookListResponseData) => this.notebooks.next(
                d.result.map((x) => new Notebook(x.id, x.name, x.created_ts, x.last_modified_ts))
            ),
            error: (e: any) => this.authService.handleError(request, e)
        });
    }

    createNotebook(name: string) {
        // Create a notebook. The Access Token is automatically added as a header to the
        // request before sending it by the AuthInterceptor service.
        const url = environment.notelist_api_url + "/notebooks/notebook";
        const data = {name: name};
        const request = this.http.post<ResponseData>(url, data);

        request.subscribe({
            next: (d: ResponseData) => this.loadNotebooks(),
            error: (e: any) => this.authService.handleError(request, e)
        })
    }

    private loadNotes() {
        // Get the list of notes of the current notebook. The Access Token is automatically
        // added as a header to the request before sending it by the AuthInterceptor service.
        const notebook_id = this.currentNotebook.value?.id;
        if (notebook_id === null) return;

        const url = environment.notelist_api_url + "/notes/notes/" + notebook_id;
        const data = {"archived": false};
        const request = this.http.post<NoteListResponseData>(url, data);

        request.subscribe({
            next: (d: NoteListResponseData) => this.currentNotebookNotes.next(
                d.result.map((x) => new NotePreview(x.id, x.title, x.tags))
            ),
            error: (e: any) => this.authService.handleError(request, e)
        });
    }
}
