import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SelectNotebookDialogComponent } from "src/app/select-notebook-dialog/select-notebook-dialog.component";
import { ManageNotebooksDialogComponent } from "src/app/manage-notebooks-dialog/manage-notebooks-dialog.component";
import { UserService } from "src/app/services/user.service";
import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";
import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";
import { Note } from "src/app/models/note.model";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit, OnDestroy {
    user: User = new User();
    notebooks: Notebook[] = [];
    currentNotebook: Notebook | null = null;
    search = "";

    userSub: Subscription | undefined;
    notebooksSub: Subscription | undefined;
    currentNotebookSub: Subscription | undefined;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private userService: UserService,
        private noteService: NoteService,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.user.subscribe({
            next: (user: User | null) => {
                if (user) this.user = user;
                else this.user = new User();
            }
        });

        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });

        this.currentNotebookSub = this.notebookService.currentNotebook.subscribe({
            next: (notebook: Notebook | null) => this.currentNotebook = notebook
        });
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";
        if (this.currentNotebook) return this.currentNotebook.name;
        return "- Select a notebook -";
    }

    onNotebookTitleClick() {
        this.modalService.open(SelectNotebookDialogComponent);
    }

    onNewNoteClick() {
        if (!this.currentNotebook) return;

        const notebookId = this.currentNotebook.id;
        const note = new Note();
        note.notebookId = notebookId;

        this.noteService.createNote(note).subscribe({
            next: (id: string) => this.router.navigateByUrl(
                "/notebooks/" + notebookId + "/" + id + "/edit"
            )
        });
    }

    onManageNotebooksClick() {
        const d = this.modalService.open(ManageNotebooksDialogComponent);
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
        this.notebooksSub?.unsubscribe();
        this.currentNotebookSub?.unsubscribe();
    }
}
