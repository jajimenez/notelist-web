import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, map, catchError } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { NotePreview, Note } from "src/app/models/note.model";

interface TagResponse {
    name: string,
    color: string | null
}

interface NoteListResponseData {
    message: string,
    message_type: string,
    result: [
        {
            id: string,
            title: string | null,
            tags: TagResponse[]
        }
    ]
}

interface NoteResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        title: string | null,
        body: string | null,
        tags: TagResponse[],
        created: string | null,
        last_modified: string | null
    }
}

@Injectable({providedIn: "root"})
export class NoteService {
    currentNoteId = new BehaviorSubject<string | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) {}

    // Get the notes of a given notebook. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    getNotebookNotes(notebookId: string): Observable<NotePreview[]> {
        const url = environment.notelistApiUrl + "/notes/notes/" + notebookId;
        const data = {"archived": false};
        const request = this.http.post<NoteListResponseData>(url, data);

        return request.pipe(
            map((d: NoteListResponseData) => d.result.map((x) => new NotePreview(x.id, x.title, x.tags))),
            catchError(e => this.authService.handleError(request, e))
        );
    }

    // Get a given note. The Access Token is automatically added as a header
    // to the request before sending it by the AuthInterceptor service.
    getNote(id: string): Observable<Note> {
        const url = environment.notelistApiUrl + "/notes/note/" + id;
        const request = this.http.get<NoteResponseData>(url);

        return request.pipe(
            map((d: NoteResponseData) => new Note(
                d.result.id, d.result.title, d.result.body, d.result.tags,
                d.result.created, d.result.last_modified
            )),
            catchError(e => this.authService.handleError(request, e))
        );
    }
}
