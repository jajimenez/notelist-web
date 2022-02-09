import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { NotePreview } from "src/app/models/note.model";
import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";

@Component({
    selector: "app-notebook",
    templateUrl: "./notebook.component.html",
    styleUrls: ["./notebook.component.css"]
})
export class NotebookComponent implements OnInit, OnDestroy {
    notes: NotePreview[] = [];
    notesSub: Subscription | undefined;

    constructor(
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.notesSub = this.noteService.notes.subscribe({
            next: (notes: NotePreview[]) => this.notes = notes
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const notebookId: string = params["notebook_id"];
                if (notebookId) this.notebookService.setCurrentNotebook(notebookId).subscribe();
            }
        });
    }

    ngOnDestroy(): void {
        this.notesSub?.unsubscribe();
        this.notebookService.setCurrentNotebook(null);
    }
}
