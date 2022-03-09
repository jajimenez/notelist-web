import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params, UrlSegment } from "@angular/router";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { AddTagDialogComponent } from "./add-tag-dialog/add-tag-dialog.component";
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
        private modalService: NgbModal,
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
        });
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

    onDeleteClick() {
        const d = this.modalService.open(ConfirmationDialogComponent);

        d.componentInstance.title = "Delete note";
        d.componentInstance.message = "Are you sure that you want to delete the note?";

        d.closed.subscribe({
            next: () => this.deleteNote()
        });
    }

    private deleteNote() {
        this.noteService.deleteNote(this.note.id).subscribe({
            next: () => this.close()
        });
    }

    close() {
        if (this.notebookId) this.router.navigateByUrl("/notebooks/" + this.notebookId);
    }

    onSaveClick() {
        this.noteService.updateNote(this.note).subscribe({
            next: () => this.saveNote()
        });
    }

    private saveNote() {
        const url = "/notebooks/" + this.notebookId + "/" + this.note.id;
        this.router.navigateByUrl(url);
    }

    onDiscardClick() {
        const url = "/notebooks/" + this.notebookId + "/" + this.note.id;
        this.router.navigateByUrl(url);
    }

    onAddTagClick() {
        const d = this.modalService.open(AddTagDialogComponent);
        d.componentInstance.tags = this.note.tags;

        d.closed.subscribe({
            next: (tag: string) => this.note.tags.push(tag)
        });
    }

    onTagClose(tag: string) {
        this.note.tags = this.note.tags.filter((t: string) => t != tag);
    }

    resizeBodyTa(bodyTa: HTMLElement) {
        bodyTa.style.height = "auto";
        bodyTa.style.height = bodyTa.scrollHeight + "px";
    }

    onBodyInput(bodyTa: HTMLElement) {
        this.resizeBodyTa(bodyTa);
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
