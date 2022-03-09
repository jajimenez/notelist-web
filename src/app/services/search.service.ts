import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { NotebookSearchResult, NoteSearchResult, SearchResult } from "../models/search.model";


interface SearchNotebookResponseData {
    id: string,
    name: string,
    tag_colors: {[id: string]: string} | undefined,
    created: string,
    last_modified: string
}

interface SearchNoteResponseData {
    id: string,
    notebook_id: string,
    archived: boolean,
    title: string | undefined,
    tags: string[] | undefined,
    created: string | undefined,
    last_modified: string | undefined
}

interface SearchResponseData {
    message: string,
    message_type: string,
    result: {
        notebooks: SearchNotebookResponseData[],
        notes: SearchNoteResponseData[]
    }
}

@Injectable({providedIn: "root"})
export class SearchService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    // Search for notebooks and notes. The Access Token is automatically added as
    // a header to the request before sending it by the AuthInterceptor service.
    search(s: string): Observable<SearchResult> {
        const url = environment.notelistApiUrl + "/search/" + s;
        const request = this.http.get<SearchResponseData>(url);

        return request.pipe(
            catchError(e => this.authService.handleError(request, e)),
            map((d: SearchResponseData) => {
                return new SearchResult(
                    d.result.notebooks.map(
                        (x: SearchNotebookResponseData) => new NotebookSearchResult(
                            x.id, x.name, x.tag_colors, x.created, x.last_modified
                        )
                    ),
                    d.result.notes.map(
                        (x: SearchNoteResponseData) => new NoteSearchResult(
                            x.id, x.notebook_id, x.archived, x.title, x.tags,
                            x.created, x.last_modified
                        )
                    )
                );
            })
        );
    }
}
