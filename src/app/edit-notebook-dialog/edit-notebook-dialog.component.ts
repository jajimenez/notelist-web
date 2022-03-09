import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-edit-notebook-dialog",
    templateUrl: "./edit-notebook-dialog.component.html",
    styleUrls: ["./edit-notebook-dialog.component.css"]
})
export class EditNotebookDialogComponent implements OnInit {
    notebooks: Notebook[] = [];
    notebook: Notebook = new Notebook();
    notebookName: string = "";
    editMode: boolean = false;
    valid: boolean = false;
    exists: boolean = false;

    constructor(public modal: NgbActiveModal) {}

    ngOnInit(): void {
        this.editMode = this.notebook.id !== "";
        this.notebookName = this.notebook.name;
    }

    getTitle(): string {
        if (this.editMode) return "Edit notebook";
        return "New notebook";
    }

    onNameLoad(form: NgForm) {
        if (this.editMode) form.value.name = this.notebook.name;
        form.value.name = "";
    }

    onNameInput(form: NgForm) {
        const name: string = form.value.name.trim();
        this.valid = name.length > 1 && name.length < 200;

        const other = this.notebooks.find(
            (n: Notebook) => name.toLowerCase() === n.name.trim().toLowerCase()
        );

        this.exists = other !== undefined && (!this.editMode || this.notebook.id !== other.id);
    }

    onSubmit(form: NgForm) {
        if (!form.valid || !this.valid || this.exists) return;

        const result = new Notebook();
        result.id = this.notebook.id;
        result.name = form.value.name.trim();

        this.modal.close(result);
    }
}
