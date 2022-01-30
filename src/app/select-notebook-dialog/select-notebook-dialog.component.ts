import { Component, OnInit } from "@angular/core";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-select-notebook-dialog",
    templateUrl: "./select-notebook-dialog.component.html",
    styleUrls: ["./select-notebook-dialog.component.css"]
})
export class SelectNotebookDialogComponent implements OnInit {
    notebooks: Notebook[] = [];

    constructor(private notebookService: NotebookService) { }

    ngOnInit(): void {
        this.notebookService.notebooks.subscribe(
            (n: Notebook[]) => this.notebooks = n,
            (e: string) => console.error(e)
        );
    }
}
