import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Note } from "src/app/models/note.model";
import { NoteService } from "src/app/services/note.service";

@Component({
    selector: "app-note-view",
    templateUrl: "./note-view.component.html",
    styleUrls: ["./note-view.component.css"]
})
export class NoteViewComponent implements OnInit, OnDestroy {
    note: Note = new Note();
    notebookId: string = "";

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.actRoute.parent?.params.subscribe({
            next: (params: Params) => this.notebookId = params["notebook_id"]
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const id = params["note_id"];

                if (id) this.noteService.getNote(id).subscribe({
                    next: (note: Note) => {
                        this.note = note;
                        this.noteService.selectedNoteId.next(id);
                    }
                });
            }
        });
    }

    close() {
        if (this.notebookId) this.router.navigateByUrl("/notebooks/" + this.notebookId);
    }

    ngOnDestroy(): void {
        this.noteService.selectedNoteId.next(null);
    }
}
