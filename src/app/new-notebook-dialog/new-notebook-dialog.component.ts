import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Notebook } from "../models/notebook.model";

import { NotebookService } from "../services/notebook.service";

@Component({
    selector: "app-new-notebook-dialog",
    templateUrl: "./new-notebook-dialog.component.html",
    styleUrls: ["./new-notebook-dialog.component.css"]
})
export class NewNotebookDialogComponent implements OnInit {
    exists: boolean = false;

    constructor(private notebookService: NotebookService) { }

    ngOnInit(): void {
    }

    onNameInput(form: NgForm) {
        const name: string = form.value.name;

        this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => {
                this.exists = notebooks.find(
                    (n: Notebook) => name.trim().toLowerCase() === n.name.trim().toLowerCase()
                ) !== undefined
            }
        })
    }

    onSubmit(form: NgForm) {
        if (!form.valid) return;
        const name = form.value.name;

        this.notebookService.create(name).subscribe({
            error: (e: string) => console.error(e)
        })
    }
}
