import { Component, OnInit, Input } from "@angular/core";

import { NoteSearchResult } from "src/app/models/search.model";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-note-result-item",
    templateUrl: "./note-result-item.component.html",
    styleUrls: ["./note-result-item.component.css"]
})
export class NoteResultItemComponent implements OnInit {
    @Input() note: NoteSearchResult = new NoteSearchResult();
    @Input() notebooks: Notebook[] = [];

    constructor() {}

    ngOnInit(): void {}

    getNoteTitle(): string {
        if (this.note.title) return this.note.title;
        return "Untitled";
    }

    getNotebookName(): string {
        const notebook = this.notebooks.find((n: Notebook) => n.id === this.note.notebookId);

        if (notebook) return notebook.name;
        return "";
    }
}
