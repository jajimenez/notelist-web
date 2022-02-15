import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-new-notebook-dialog",
    templateUrl: "./new-notebook-dialog.component.html",
    styleUrls: ["./new-notebook-dialog.component.css"]
})
export class NewNotebookDialogComponent implements OnInit {
    @Input() notebooks: Notebook[] = [];
    valid: boolean = false;
    exists: boolean = false;

    constructor(private notebookService: NotebookService) {}

    ngOnInit(): void {}

    onNameInput(form: NgForm) {
        const name: string = form.value.name.trim();
        this.valid = name.length !== 0;

        this.exists = this.notebooks.find(
            (n: Notebook) => name.toLowerCase() === n.name.trim().toLowerCase()
        ) !== undefined
    }

    onSubmit(form: NgForm) {
        if (!form.valid || !this.valid || this.exists) return;

        const name = form.value.name.trim();
        this.notebookService.createNotebook(name).subscribe();
    }
}
