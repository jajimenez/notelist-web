import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";
import { Notebook } from "src/app/models/notebook.model";
import { Note } from "src/app/models/note.model";

@Component({
    selector: "app-note-view",
    templateUrl: "./note-view.component.html",
    styleUrls: ["./note-view.component.css"]
})
export class NoteViewComponent implements OnInit, OnDestroy {
    notebook: Notebook = new Notebook();
    notebookId: string = "";
    note: Note = new Note();

    currentNotebookSub: Subscription | undefined;
    currentNoteSub: Subscription | undefined;

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService,
        private noteService: NoteService
    ) {}

    ngOnInit(): void {
        this.currentNotebookSub = this.notebookService.currentNotebook.subscribe({
            next: (notebook: Notebook | null) => {
                if (notebook) this.notebook = notebook;
                else this.note = new Note();
            }
        });

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

    getTagColor(name: string): string | undefined {
        if (this.notebook.tagColors) return this.notebook.tagColors[name];
        return undefined;
    }

    close() {
        if (this.notebookId) this.router.navigateByUrl("/notebooks/" + this.notebookId);
    }

    ngOnDestroy(): void {
        this.currentNotebookSub?.unsubscribe();
        this.currentNoteSub?.unsubscribe();
        this.noteService.setCurrentNote(null);
    }
}
