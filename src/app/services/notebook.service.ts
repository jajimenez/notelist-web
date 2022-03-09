import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError, Subscriber } from "rxjs";
import { map, exhaustMap, tap, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { User } from "../models/user.model";
import { Notebook } from "src/app/models/notebook.model";

interface ResponseData {
    message: string,
    message_type: string
}

interface NotebookData {
    id: string,
    user_id: string,
    name: string,
    tag_colors: {[id: string]: string} | undefined,
    created: string,
    last_modified: string
}

interface NotebookListResponseData {
    message: string,
    message_type: string,
    result: NotebookData[]
}

interface NotebookResponseData {
    message: string,
    message_type: string,
    result: NotebookData
}

@Injectable({providedIn: "root"})
export class NotebookService {
    notebooks = new BehaviorSubject<Notebook[]>([]);
    currentNotebook = new BehaviorSubject<Notebook | null>(null);

    constructor(private http: HttpClient, private authService: AuthService, private userService: UserService) {
        this.userService.user.subscribe({
            next: (user: User | null) => this.updateNotebooks(user)
        });
    }

    // Update the notebooks
    private updateNotebooks(user: User | null) {
        if (user) {
            this.getNotebooks().subscribe({
                next: (notebooks: Notebook[]) => this.notebooks.next(notebooks)
            });
        } else {
            this.notebooks.next([]);
        }
    }

    // Get the notebooks of the current user. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    private getNotebooks(): Observable<Notebook[]> {
        const url = environment.notelistApiUrl + "/notebooks/notebooks";
        const request = this.http.get<NotebookListResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),

            map((d: NotebookListResponseData) => d.result.map(
                (x) => new Notebook(
                    x.id, x.user_id, x.name, x.tag_colors,
                    x.created, x.last_modified
                )
            ))
        );
    }

    // Get a given notebook of the current user. The Access Token is automatically added
    // as a header to the request before sending it by the AuthInterceptor service.
    private getNotebook(id: string): Observable<Notebook> {
        const url = environment.notelistApiUrl + "/notebooks/notebook/" + id;
        const request = this.http.get<NotebookResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),

            map((d: NotebookResponseData) => new Notebook(
                d.result.id, d.result.user_id, d.result.name, d.result.tag_colors,
                d.result.created, d.result.last_modified
            ))
        );
    }

    // Set the current notebook
    setCurrentNotebook(id: string | null): Observable<void> {
        if (id) {
            return this.getNotebook(id).pipe(
                tap((n: Notebook) => this.currentNotebook.next(n)),
                map((n: Notebook) => undefined)
            )
        } else {
            return new Observable(
                (subscriber: Subscriber<void>) => {
                    this.currentNotebook.next(null);

                    subscriber.next();
                    subscriber.complete();
                }
            );
        }
    }

    // Create a notebook. The Access Token is automatically added as a header
    // to the request before sending it by the AuthInterceptor service.
    createNotebook(name: string): Observable<void> {
        const url = environment.notelistApiUrl + "/notebooks/notebook";
        const data = {name: name};
        const request = this.http.post<ResponseData>(url, data);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            map((d: ResponseData) => undefined),
            tap(() => this.updateNotebooks(this.userService.user.value))
        );
    }

    // Update an existing notebook
    updateNotebook(notebook: Notebook): Observable<void> {
        if (!notebook.id) return throwError(() => new Error("Notebook does not have an ID."));
        const url = environment.notelistApiUrl + "/notebooks/notebook/" + notebook.id;

        const data = {
            name: notebook.name,
            tag_colors: notebook.tagColors
        }

        const request = this.http.put<ResponseData>(url, data);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            tap(() => this.updateNotebooks(this.userService.user.value)),
            map((d: ResponseData) => undefined)
        );
    }

    // Delete an existing notebook
    deleteNotebook(id: string): Observable<void> {
        const url = environment.notelistApiUrl + "/notebooks/notebook/" + id;
        const request = this.http.delete<ResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            tap(() => {
                this.updateNotebooks(this.userService.user.value);
            }),
            map((d: ResponseData) => {}),
            exhaustMap(() =>  this.setCurrentNotebook(null))
        );
    }
}
