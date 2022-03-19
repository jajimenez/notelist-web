import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SelectNotebookDialogComponent } from "src/app/select-notebook-dialog/select-notebook-dialog.component";
import { ManageNotebooksDialogComponent } from "src/app/manage-notebooks-dialog/manage-notebooks-dialog.component";
import { SearchDialogComponent } from "src/app/search-dialog/search-dialog.component";
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

    menuCollapsed: boolean = true;
    search: string = "";
    searchValid: boolean = false;
    lastModSort: boolean = false;
    ascSort: boolean = false;

    userSub: Subscription | undefined;
    notebooksSub: Subscription | undefined;
    currentNotebookSub: Subscription | undefined;
    lastModSortSub: Subscription | undefined;
    ascSortSub: Subscription | undefined;

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

        this.lastModSortSub = this.noteService.lastModSort.subscribe({
            next: (lastModSort: boolean) => this.lastModSort = lastModSort
        });

        this.ascSortSub = this.noteService.ascSort.subscribe({
            next: (asc: boolean) => this.ascSort = asc
        });
    }

    isLastModSortAsc() {
        return this.lastModSort && this.ascSort;
    }

    isLastModSortDes() {
        return this.lastModSort && !this.ascSort;
    }

    isCreatedSortAsc() {
        return !this.lastModSort && this.ascSort;
    }

    isCreatedSortDes() {
        return !this.lastModSort && !this.ascSort;
    }

    onSortOptionClick(lastMod: boolean, asc: boolean) {
        this.noteService.lastModSort.next(lastMod);
        this.noteService.ascSort.next(asc);
        this.noteService.updateNoteList().subscribe();
    }

    toggleMenu() {
        this.menuCollapsed = !this.menuCollapsed;
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";
        if (this.currentNotebook) return this.currentNotebook.name;
        return "- Select a notebook -";
    }

    onNotebookTitleClick() {
        this.modalService.open(SelectNotebookDialogComponent, { scrollable: true });
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

    onSearchInput(form: NgForm) {
        const search: string = form.value.search.trim();
        this.searchValid = search.length > 1 && search.length < 200;
    }

    onSearchSubmit(form: NgForm) {
        if (!form.valid || !this.searchValid) return;

        const search = form.value.search.trim();
        const d = this.modalService.open(SearchDialogComponent, { scrollable: true });
        d.componentInstance.search(search);

        this.search = "";
    }

    onManageNotebooksClick() {
        const d = this.modalService.open(ManageNotebooksDialogComponent, { scrollable: true });
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
        this.notebooksSub?.unsubscribe();
        this.currentNotebookSub?.unsubscribe();
        this.lastModSortSub?.unsubscribe();
        this.ascSortSub?.unsubscribe();
    }
}
