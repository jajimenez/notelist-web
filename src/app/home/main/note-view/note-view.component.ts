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

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const note_id = params["note_id"];

                this.noteService.getNote(note_id).subscribe({
                    next: (n: Note) => this.note = n,
                    error: (e: string) => console.log(e)
                });
            }
        });
    }

    close() {
        this.actRoute.parent?.params.subscribe({
            next: (params: Params) => {
                const notebook_id = params["notebook_id"];
                this.router.navigate(["notebooks", notebook_id]);
            }
        });
    }
}
