import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { NoteService } from "src/app/services/note.service";
import { NotePreview, Note } from "src/app/models/note.model";

@Component({
    selector: "app-note-list",
    templateUrl: "./note-list.component.html",
    styleUrls: ["./note-list.component.css"]
})
export class NoteListComponent implements OnInit, OnDestroy {
    notesSub: Subscription | null = null;
    currentNoteSub: Subscription | null = null;
    paramsSub: Subscription | null = null;

    notes: NotePreview[] = [];
    currentNote: string | null = null;

    constructor(private route: ActivatedRoute, private noteService: NoteService) {}

    ngOnInit(): void {
        this.notesSub = this.noteService.notes.subscribe({
            next: (notes: NotePreview[]) => this.notes = notes
        });

        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (note: Note | null) => {
                if (note) this.currentNote = note.id;
                else this.currentNote = null;
            }
        });

        this.paramsSub = this.route.params.subscribe({
            next: (params: Params) => {
                const notebook_id = params["notebook_id"];
                if (notebook_id) this.noteService.loadNotebookNotes(notebook_id);
            }
        });
    }

    ngOnDestroy(): void {
        this.notesSub?.unsubscribe();
        this.currentNoteSub?.unsubscribe();
        this.paramsSub?.unsubscribe();
    }
}
