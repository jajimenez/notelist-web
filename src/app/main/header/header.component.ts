import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";

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
        private userService: UserService,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.user.subscribe({
            next: (user: User | null) => {
                if (user) this.user = user;
                else this.user = new User();
            }
        })

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

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
        this.notebooksSub?.unsubscribe();
        this.currentNotebookSub?.unsubscribe();
    }
}
