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
    currentNotebookId: string | null = null;
    search = "";

    notebookSub: Subscription | undefined;


    constructor(
        private userService: UserService,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.userService.getUser().subscribe({
            next: (user: User) => this.user = user
        })

        this.notebookService.getNotebooks().subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });

        this.notebookSub = this.notebookService.currentNotebookId.subscribe({
            next: (id: string | null) => this.currentNotebookId = id
        });
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";

        const name = this.notebooks.find(
            (n: Notebook) => this.currentNotebookId && n.id === this.currentNotebookId
        )?.name

        if (name) return name;
        return "- Select a notebook -";
    }

    ngOnDestroy(): void {
        this.notebookSub?.unsubscribe();
    }
}
