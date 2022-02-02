import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { NoteService } from "src/app/services/note.service";
import { NotePreview } from "src/app/models/note.model";

@Component({
    selector: "app-note-list",
    templateUrl: "./note-list.component.html",
    styleUrls: ["./note-list.component.css"]
})
export class NoteListComponent implements OnInit {
    notes: NotePreview[] = [];

    constructor(private route: ActivatedRoute, private noteService: NoteService) {}

    ngOnInit(): void {
        this.noteService.notes.subscribe({
            next: (notes: NotePreview[]) => this.notes = notes
        });

        this.route.params.subscribe({
            next: (params: Params) => {
                const notebook_id = params["notebook_id"];
                if (notebook_id) this.noteService.loadNotebookNotes(notebook_id);
            }
        });
    }
}
