import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { NotebookService } from "./notebook.service";
import { Notebook } from "../models/notebook.model";
import { NotePreview, Note } from "src/app/models/note.model";

interface NoteListResponseData {
    message: string,
    message_type: string,
    result: [
        {
            id: string,
            notebook_id: string,
            archived: boolean,
            title: string | undefined,
            tags: string[] | undefined,
            created: string | undefined,
            last_modified: string | undefined
        }
    ]
}

interface NoteResponseData {
    message: string,
    message_type: string,
    result: {
        id: string,
        notebook_id: string,
        archived: boolean,
        title: string | undefined,
        body: string | undefined,
        tags: string[] | undefined,
        created: string | undefined,
        last_modified: string | undefined
    }
}

interface CreateNoteResponseData {
    message: string,
    message_type: string,
    result: {
        id: string
    }
}

interface UpdateNoteResponseData {
    message: string,
    message_type: string
}

@Injectable({providedIn: "root"})
export class NoteService {
    notes = new BehaviorSubject<NotePreview[]>([]);
    currentNote = new BehaviorSubject<Note | null>(null);

    constructor(private http: HttpClient, private authService: AuthService, private notebookService: NotebookService) {
        this.notebookService.currentNotebook.subscribe({
            next: (notebook: Notebook | null) => this.updateNotes(notebook)
        });

        this.notes.subscribe({
            next: (notes: NotePreview[]) => this.updateCurrentNote(notes)
        });
    }

    // Update the notes
    private updateNotes(notebook: Notebook | null) {
        if (notebook) {
            this.getNotebookNotes(notebook.id).subscribe({
                next: (notes: NotePreview[]) => this.notes.next(notes)
            });
        } else {
            this.notes.next([]);
        }
    }

    // Update the current note
    private updateCurrentNote(notes: NotePreview[]) {
        if (!notes.find((n: NotePreview) => n.id === this.currentNote.value?.id)) {
            this.currentNote.next(null);
        }
    }

    // Get the notes of a given notebook. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    private getNotebookNotes(notebookId: string): Observable<NotePreview[]> {
        const url = environment.notelistApiUrl + "/notes/notes/" + notebookId;
        const data = {"archived": false};
        const request = this.http.post<NoteListResponseData>(url, data);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),

            map((d: NoteListResponseData) => d.result.map(
                (x) => new NotePreview(
                    x.id, x.notebook_id, x.archived, x.title, x.tags,
                    x.created, x.last_modified
                )
            ))
        );
    }

    // Get a given note. The Access Token is automatically added as a header
    // to the request before sending it by the AuthInterceptor service.
    private getNote(id: string): Observable<Note> {
        const url = environment.notelistApiUrl + "/notes/note/" + id;
        const request = this.http.get<NoteResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),

            map((d: NoteResponseData) => new Note(
                d.result.id, d.result.notebook_id, d.result.archived, d.result.title,
                d.result.body, d.result.tags, d.result.created, d.result.last_modified
            ))
        );
    }

    // Set the current note
    setCurrentNote(id: string | null): Observable<void> | void {
        if (id) {
            return this.getNote(id).pipe(
                tap((n: Note) => this.currentNote.next(n)),
                map((n: Note) => undefined)
            )
        } else {
            this.currentNote.next(null);
        }
    }

    // Create a new note
    createNote(note: Note): Observable<string> {
        if (note.id) return throwError(() => new Error("Note has an ID."));
        const url = environment.notelistApiUrl + "/notes/note";

        const data = {
            notebook_id: note.notebookId,
            archived: note.archived,
            title: note.title,
            body: note.body,
            tags: note.tags
        }

        const request = this.http.post<UpdateNoteResponseData>(url, data);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            tap(() => this.updateNotes(this.notebookService.currentNotebook.value)),
            map((d: CreateNoteResponseData) => d.result.id)
        );
    }

    // Update an existing note
    updateNote(note: Note): Observable<void> {
        if (!note.id) return throwError(() => new Error("Note does not have an ID."));
        const url = environment.notelistApiUrl + "/notes/note/" + note.id;

        const data = {
            notebook_id: note.notebookId,
            archived: note.archived,
            title: note.title,
            body: note.body,
            tags: note.tags
        }

        const request = this.http.put<UpdateNoteResponseData>(url, data);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            map((d: UpdateNoteResponseData) => undefined)
        );
    }
}
