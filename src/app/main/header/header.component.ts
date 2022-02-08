import { Component, OnInit } from "@angular/core";

import { NotebookService } from "src/app/services/notebook.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit {
    user: User = new User();
    notebooks: Notebook[] = [];
    search = "";

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
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";
        return "- Select a notebook -";
    }
}
