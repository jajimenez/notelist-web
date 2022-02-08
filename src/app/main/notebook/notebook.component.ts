import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { NotePreview } from "src/app/models/note.model";

import { NoteService } from "src/app/services/note.service";

@Component({
    selector: "app-notebook",
    templateUrl: "./notebook.component.html",
    styleUrls: ["./notebook.component.css"]
})
export class NotebookComponent implements OnInit {
    notes: NotePreview[] = [];

    constructor(private actRoute: ActivatedRoute, private noteService: NoteService) {}

    ngOnInit(): void {
        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const notebookId = params["notebook_id"];

                if (notebookId) this.noteService.getNotebookNotes(notebookId).subscribe({
                    next: (notes: NotePreview[]) => this.notes = notes
                });
            }
        });
    }
}
