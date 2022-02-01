import { Component, Input, OnInit } from "@angular/core";

import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit {
    search = "";
    @Input("user") user: User | null = null;
    @Input("notebooks") notebooks: Notebook[] = [];
    @Input("currentNotebook") currentNotebook: Notebook | undefined = undefined;

    constructor() {
    }

    ngOnInit(): void {
    }

    getNotebookButtonTitle() {
        if (this.notebooks.length === 0) return "- No notebooks -";
        if (this.currentNotebook === undefined) return "- Select a notebook -";
        return this.currentNotebook.name;
    }

    logout() {
        // this.authService.logout().subscribe();
    }
}
