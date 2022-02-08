import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { NoteService } from "src/app/services/note.service";
import { NotePreview } from "src/app/models/note.model";

@Component({
    selector: "app-note-item",
    templateUrl: "./note-item.component.html",
    styleUrls: ["./note-item.component.css"]
})
export class NoteItemComponent implements OnInit, OnDestroy {
    @Input() note: NotePreview = new NotePreview();
    @Input() selected: boolean = false;

    noteSub: Subscription | undefined;

    constructor(private noteService: NoteService) {}

    ngOnInit(): void {
        this.noteSub = this.noteService.currentNoteId.subscribe({
            next: (id: string | null) => this.selected = (id !== null && this.note.id === id)
        })
    }

    ngOnDestroy(): void {
        this.noteSub?.unsubscribe();
    }
}
