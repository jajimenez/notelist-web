import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params, UrlSegment } from "@angular/router";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";
import { Notebook } from "src/app/models/notebook.model";
import { Note } from "src/app/models/note.model";

@Component({
    selector: "app-note",
    templateUrl: "./note.component.html",
    styleUrls: ["./note.component.css"]
})
export class NoteComponent implements OnInit, OnDestroy {
    notebook: Notebook = new Notebook();
    notebookId: string = "";
    note: Note = new Note();
    noteLoaded: boolean = false;
    editMode: boolean = false;
    test: string | undefined = "hola";

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
                else this.notebook = new Notebook();
            }
        });

        this.currentNoteSub = this.noteService.currentNote.subscribe({
            next: (note: Note | null) => {
                if (note) {
                    this.note = note;
                    this.noteLoaded = true;
                } else {
                    this.note = new Note();
                }
            }
        });

        this.actRoute.parent?.params.subscribe({
            next: (params: Params) => this.notebookId = params["notebook_id"]
        });

        this.actRoute.params.subscribe({
            next: (params: Params) => {
                const id = params["note_id"];
                if (id) this.noteService.setCurrentNote(id)?.subscribe();
            }
        });

        this.actRoute.url.subscribe({
            next: (url: UrlSegment[]) => {
                if (url.find((u: UrlSegment) => u.path === "edit")) this.editMode = true;
                else this.editMode = false;
            }
        })
    }

    getTitle(): string {
        if (this.note.title) return this.note.title;
        if (this.noteLoaded) return "Untitled";
        return "";
    }

    getTagColor(name: string): string | undefined {
        if (this.notebook.tagColors) return this.notebook.tagColors[name];
        return undefined;
    }

    onEditClick() {
        const url = "/notebooks/" + this.notebookId + "/" + this.note.id +  "/edit";
        this.router.navigateByUrl(url);
    }

    resizeBodyTa(bodyTa: HTMLElement) {
        bodyTa.style.height = "auto";
        bodyTa.style.height = bodyTa.scrollHeight + "px";
    }

    onBodyInput(bodyTa: HTMLElement) {
        this.resizeBodyTa(bodyTa);
    }

    onSaveClick() {
        this.noteService.updateNote(this.note).subscribe({
            next: (() => {
                const url = "/notebooks/" + this.notebookId + "/" + this.note.id;
                this.router.navigateByUrl(url);
            })
        });
    }

    onDiscardClick() {
        const url = "/notebooks/" + this.notebookId + "/" + this.note.id;
        this.router.navigateByUrl(url);
    }

    onCloseClick() {
        if (this.notebookId) this.router.navigateByUrl("/notebooks/" + this.notebookId);
    }

    ngAfterContentChecked() {
        if (this.editMode) {
            const bodyTa = document.getElementById("bodyTa");
            if (bodyTa) this.resizeBodyTa(bodyTa);
        }
    }

    ngOnDestroy(): void {
        this.currentNotebookSub?.unsubscribe();
        this.currentNoteSub?.unsubscribe();
        this.noteService.setCurrentNote(null);
    }
}
