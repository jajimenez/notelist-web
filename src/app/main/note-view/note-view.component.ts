import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { Note } from "src/app/models/note.model";
import { NoteService } from "src/app/services/note.service";

@Component({
    selector: "app-note-view",
    templateUrl: "./note-view.component.html",
    styleUrls: ["./note-view.component.css"]
})
export class NoteViewComponent implements OnInit, OnDestroy {
    notebookId: string = "";
    note: Note = new Note();

    currentNoteSub: Subscription | undefined;

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (note: Note | null) => {
                if (note) this.note = note;
                else this.note = new Note();
            }
        });

        this.actRoute.parent?.params.subscribe({
            next: (params: Params) => this.notebookId = params["notebook_id"]
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const id = params["note_id"];
                if (id) this.noteService.setCurrentNote(id).subscribe();
            }
        });
    }

    close() {
        if (this.notebookId) this.router.navigateByUrl("/notebooks/" + this.notebookId);
    }

    ngOnDestroy(): void {
        this.currentNoteSub?.unsubscribe();
        this.noteService.setCurrentNote(null);
    }
}
