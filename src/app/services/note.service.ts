import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, catchError } from "rxjs";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { NotebookService } from "./notebook.service";
import { Notebook } from "src/app/models/notebook.model";
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
    // BehaviorSubject is a type of Subject, and therefore a type of Observable, which
    // allows us not only to subscribe to it whenever a new value of the user object
    // is available but also to get the current value even if we subscribed after that
    // value was set.
    notes = new BehaviorSubject<NotePreview[]>([]);
    currentNote = new BehaviorSubject<Note | null>(null);
    currentNotebook = new BehaviorSubject<Notebook | null>(null);

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private notebookService: NotebookService
    ) {
        this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.closeNotes(),
            error: (e: any) => this.closeNotes()
        });
    }

    private closeNotes() {
        this.notes.next([]);
        this.currentNote.next(null);
        this.currentNotebook.next(null);
    }

    // Load the notes of a given notebook. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    loadNotebookNotes(notebook_id: string) {
        const url = environment.notelist_api_url + "/notes/notes/" + notebook_id;
        const data = {"archived": false};
        const request = this.http.post<NoteListResponseData>(url, data);

        request.pipe(
            map((d: NoteListResponseData) => d.result.map((x) => new NotePreview(x.id, x.title, x.tags))),
            catchError(e => this.authService.handleError(request, e))
        ).subscribe({
            next: (notes: Note[]) => {
                this.notes.next(notes);
                const notebook = this.notebookService.notebooks.value.find(n => n.id === notebook_id);

                // Set the current note
                this.currentNote.next(null);

                // Set the current notebook
                if (notebook) this.currentNotebook.next(notebook);
                else this.currentNotebook.next(null);
            }
        });
    }

    // Load a given note. The Access Token is automatically added as a header
    // to the request before sending it by the AuthInterceptor service.
    loadNote(note_id: string) {
        const url = environment.notelist_api_url + "/notes/note/" + note_id;
        const request = this.http.get<NoteResponseData>(url);

        request.pipe(
            map((d: NoteResponseData) => new Note(
                d.result.id, d.result.title, d.result.body, d.result.tags,
                d.result.created, d.result.last_modified
            )),
            catchError(e => this.authService.handleError(request, e))
        ).subscribe({
            next: (note: Note) => this.currentNote.next(note)
        });
    }
}
