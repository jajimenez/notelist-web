import { Component, Input, OnInit } from "@angular/core";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-manage-notebooks-dialog",
    templateUrl: "./manage-notebooks-dialog.component.html",
    styleUrls: ["./manage-notebooks-dialog.component.css"]
})
export class ManageNotebooksDialogComponent implements OnInit {
    @Input() notebooks: Notebook[] = [];
    checkedNotebooks: string[] = [];

    constructor() {}

    ngOnInit(): void {}

    toggleChecked(e: Event, notebookId: string) {
        const checkboxId = "checkbox_" + notebookId;
        const checkbox: HTMLInputElement = document.getElementById(checkboxId) as HTMLInputElement;

        if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.checkedNotebooks.push(notebookId);
        } else {
            const i = this.checkedNotebooks.indexOf(notebookId);
            this.checkedNotebooks.splice(i, 1);
        }
    }
}
