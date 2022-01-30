import { Component, Input, OnInit } from "@angular/core";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-manage-notebooks-dialog",
    templateUrl: "./manage-notebooks-dialog.component.html",
    styleUrls: ["./manage-notebooks-dialog.component.css"]
})
export class ManageNotebooksDialogComponent implements OnInit {
    notebooks: Notebook[] = [];
    checkedNotebooks: string[] = [];

    constructor(private notebookService: NotebookService) { }

    ngOnInit(): void {
        this.notebookService.notebooks.subscribe({
            next: (n: Notebook[]) => this.notebooks = n,
            error: (e: string) => console.error(e)
        });
    }

    toggleChecked(e: Event, notebookId: string) {
        const checkboxId = "checkbox_" + notebookId;
        const checkbox: HTMLInputElement = document.getElementById(checkboxId) as HTMLInputElement;

        if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.checkedNotebooks.push(notebookId);
        }
        else {
            const i = this.checkedNotebooks.indexOf(notebookId);
            this.checkedNotebooks.splice(i, 1);
        }
    }
}
