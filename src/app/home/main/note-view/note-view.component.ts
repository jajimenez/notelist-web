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
    currentNoteSub: Subscription | null = null;
    paramsSub: Subscription | null = null;
    parParamsSub: Subscription | undefined;

    note: Note | null = null;
    notebook_id: string | null = null;

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (n: Note | null) => this.note = n
        });

        this.paramsSub = this.actRoute.params.subscribe({
            next: (params: Params) => {
                const note_id = params["note_id"];
                if (note_id) this.noteService.loadNote(note_id);
            }
        });

        this.parParamsSub = this.actRoute.parent?.params.subscribe({
            next: (params: Params) => this.notebook_id = params["notebook_id"]
        });
    }

    close() {
        if (this.notebook_id) {
            this.noteService.closeCurrentNote();
            this.router.navigate(["notebooks", this.notebook_id]);
        }
    }

    ngOnDestroy(): void {
        this.currentNoteSub?.unsubscribe();
        this.paramsSub?.unsubscribe();
        this.parParamsSub?.unsubscribe();
    }
}
