import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Notebook } from "src/app/models/notebook.model";

import { NotebookService } from "src/app/services/notebook.service";

@Component({
    selector: "app-new-notebook-dialog",
    templateUrl: "./new-notebook-dialog.component.html",
    styleUrls: ["./new-notebook-dialog.component.css"]
})
export class NewNotebookDialogComponent implements OnInit {
    notebooks: Notebook[] = [];
    exists: boolean = false;

    constructor(private notebookService: NotebookService) { }

    ngOnInit(): void {
        this.notebookService.getNotebooks().subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks,
            error: (e: string) => console.error(e)
        });
    }

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
