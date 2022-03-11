import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";
import { NotePreview, Note } from "src/app/models/note.model";

@Component({
    selector: "app-notebook",
    templateUrl: "./notebook.component.html",
    styleUrls: ["./notebook.component.css"]
})
export class NotebookComponent implements OnInit, OnDestroy {
    mobileWidth: boolean = false;
    noteOpen: boolean = false;
    notes: NotePreview[] = [];

    notesSub: Subscription | undefined;
    currentNoteSub: Subscription | undefined;

    constructor(
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService,
        private noteService: NoteService,
    ) {}

    ngOnInit(): void {
        this.notesSub = this.noteService.notes.subscribe({
            next: (notes: NotePreview[]) => this.notes = notes
        });

        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (note: Note | null) => this.noteOpen = note !== null
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const notebookId: string = params["notebook_id"];
                if (notebookId) this.notebookService.setCurrentNotebook(notebookId).subscribe();
            }
        });

        this.checkWindowWidth();
    }

    @HostListener("window:resize", ["$event"])
    onWindowResize(event: Event) {
        this.checkWindowWidth();
    }

    checkWindowWidth() {
        this.mobileWidth = window.innerWidth < 576;
    }

    ngOnDestroy(): void {
        this.notesSub?.unsubscribe();
        this.currentNoteSub?.unsubscribe();

        this.notebookService.setCurrentNotebook(null);
    }
}
