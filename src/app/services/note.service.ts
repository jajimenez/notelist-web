import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { NotePreview, Note } from "src/app/models/note.model";

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

interface NoteResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        title: string,
        body: string,
        tags: {name: string, color: string | null}[],
        created: string,
        last_modified: string
    }
}

@Injectable({providedIn: "root"})
export class NoteService {
    constructor(private http: HttpClient, private authService: AuthService) {
    }

    // Get the list of notes of a given notebook. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    getNotes(notebook_id: string): Observable<NotePreview[]> {
        const url = environment.notelist_api_url + "/notes/notes/" + notebook_id;
        const data = {"archived": false};
        const request = this.http.post<NoteListResponseData>(url, data);

        return request.pipe(
            map((d: NoteListResponseData) => d.result.map((x) => new NotePreview(x.id, x.title, x.tags))),
            catchError(errorResponse => this.authService.handleError(request, errorResponse))
        );
    }

    // Get and select a given note. The Access Token is automatically added as a
    // header to the request before sending it by the AuthInterceptor service.
    getNote(note_id: string): Observable<Note> {
        const url = environment.notelist_api_url + "/notes/note/" + note_id;
        const request = this.http.get<NoteResponseData>(url);

        return request.pipe(
            map((d: NoteResponseData) => new Note(
                d.result.id, d.result.title, d.result.body, d.result.tags,
                d.result.created, d.result.last_modified
            )),
            catchError(errorResponse => this.authService.handleError(request, errorResponse))
        );
    }
}
