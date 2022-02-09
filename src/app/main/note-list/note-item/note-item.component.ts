import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { NoteService } from "src/app/services/note.service";
import { NotePreview, Note } from "src/app/models/note.model";

@Component({
    selector: "app-note-item",
    templateUrl: "./note-item.component.html",
    styleUrls: ["./note-item.component.css"]
})
export class NoteItemComponent implements OnInit, OnDestroy {
    @Input() note: NotePreview = new NotePreview();
    selected: boolean = false;

    currentNoteSub: Subscription | undefined;

    constructor(private noteService: NoteService) {}

    ngOnInit(): void {
        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (note: Note | null) => this.selected = (
                note !== null && this.note.id === note.id
            )
        })
    }

    ngOnDestroy(): void {
        this.currentNoteSub?.unsubscribe();
    }
}
