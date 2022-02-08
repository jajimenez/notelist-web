import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-new-notebook-dialog",
    templateUrl: "./new-notebook-dialog.component.html",
    styleUrls: ["./new-notebook-dialog.component.css"]
})
export class NewNotebookDialogComponent implements OnInit {
    @Input() notebooks: Notebook[] = [];
    exists: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    onNameInput(form: NgForm) {
        const name: string = form.value.name;

        this.exists = this.notebooks.find(
            (n: Notebook) => name.trim().toLowerCase() === n.name.trim().toLowerCase()
        ) !== undefined
    }

    onSubmit(form: NgForm) {
        if (!form.valid) return;

        const name = form.value.name;
        // this.notebookService.createNotebook(name);
    }
}
