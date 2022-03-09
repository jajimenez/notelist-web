import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { SearchService } from "../services/search.service";
import { SearchResult } from "../models/search.model";
import { Notebook } from "../models/notebook.model";
import { NotebookService } from "../services/notebook.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-search-dialog",
    templateUrl: "./search-dialog.component.html",
    styleUrls: ["./search-dialog.component.css"]
})
export class SearchDialogComponent implements OnInit, OnDestroy {
    notebooks: Notebook[] = [];
    _search: string = "";
    searching: boolean = true;
    result: SearchResult = new SearchResult();
    notebooksSub: Subscription | undefined;

    constructor(
        public modal: NgbActiveModal,
        private notebookService: NotebookService,
        private searchService: SearchService
    ) {}

    ngOnInit(): void {
        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });
    }

    search(s: string) {
        this._search = s;

        this.searchService.search(s).subscribe({
            next: (r: SearchResult) => {
                this.result = r;
                this.searching = false;
            }
        });
    }

    getTitle() {
        return "Search results for <b>" + this._search + "</b>";
    }

    getNotebooksTitle() {
        return "Notebooks (" + this.result.notebooks.length + ")";
    }

    getNotesTitle() {
        return "Notes (" + this.result.notes.length + ")";
    }

    ngOnDestroy(): void {
        this.notebooksSub?.unsubscribe();
    }
}
