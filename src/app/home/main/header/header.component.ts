import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { NotebookService } from "src/app/services/notebook.service";
import { NoteService } from "src/app/services/note.service";
import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit, OnDestroy {
    userSub: Subscription | null = null;
    notebooksSub: Subscription | null = null;
    currentNotebookSub: Subscription | null = null;

    search = "";
    user: User | null = null;
    notebooks: Notebook[] = [];
    currentNotebook: Notebook | null = null;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private notebookService: NotebookService,
        private noteService: NoteService) {
    }

    ngOnInit(): void {
        this.userSub = this.userService.user.subscribe({
            next: (user: User | null) => this.user = user
        });

        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });

        this.currentNotebookSub = this.noteService.currentNotebook.subscribe({
            next: (notebook: Notebook | null) => this.currentNotebook = notebook
        });
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";
        if (this.currentNotebook === null) return "- Select a notebook -";
        return this.currentNotebook.name;
    }

    logout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
        this.notebooksSub?.unsubscribe();
        this.currentNotebookSub?.unsubscribe();
    }
}
