import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

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
    name: string,
    tag_colors: {[id: string]: string} | undefined,
    created: string | undefined,
    last_modified: string | undefined
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
                (x) => new Notebook(x.id, x.name, x.tag_colors, x.created, x.last_modified)
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
                d.result.id, d.result.name, d.result.tag_colors,
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
            this.currentNotebook.next(null);
            return new Observable<void>();
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
}
