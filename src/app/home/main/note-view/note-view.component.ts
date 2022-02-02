import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Note } from "src/app/models/note.model";
import { NoteService } from "src/app/services/note.service";

@Component({
    selector: "app-note-view",
    templateUrl: "./note-view.component.html",
    styleUrls: ["./note-view.component.css"]
})
export class NoteViewComponent implements OnInit {
    note: Note | null = null;
    notebook_id: string | null = null;

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.noteService.currentNote.subscribe({
            next: (n: Note | null) => this.note = n
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const note_id = params["note_id"];
                if (note_id) this.noteService.loadNote(note_id);
            }
        });

        this.actRoute.parent?.params.subscribe({
            next: (params: Params) => {
                this.notebook_id = params["notebook_id"];
            }
        });
    }

    close() {
        if (this.notebook_id) {
            this.noteService.closeCurrentNote();
            this.router.navigate(["notebooks", this.notebook_id]);
        }
    }
}
