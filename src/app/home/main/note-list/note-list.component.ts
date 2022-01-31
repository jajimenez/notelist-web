import { Component, OnInit } from "@angular/core";

import { NotebookService } from "src/app/services/notebook.service";
import { NotePreview } from "src/app/models/note.model";

@Component({
    selector: "app-note-list",
    templateUrl: "./note-list.component.html",
    styleUrls: ["./note-list.component.css"]
})
export class NoteListComponent implements OnInit {
    notes: NotePreview[] = [];

    constructor(private notebookService: NotebookService) { }

    ngOnInit(): void {
        this.notebookService.currentNotebookNotes.subscribe({
            next: (notes: NotePreview[]) => this.notes = notes,
            error: (e: string) => console.error(e)
        });
    }
}
