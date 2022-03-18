import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Notebook } from "src/app/models/notebook.model";

class TagColor {
    constructor(
        public tag: string = "",
        public color: string = ""
    ) {}
}

@Component({
    selector: "app-edit-notebook-dialog",
    templateUrl: "./edit-notebook-dialog.component.html",
    styleUrls: ["./edit-notebook-dialog.component.css"]
})
export class EditNotebookDialogComponent implements OnInit {
    notebooks: Notebook[] = [];
    notebook: Notebook = new Notebook();
    name: string = "";
    tagColors: TagColor[] = [];

    editMode: boolean = false;
    valid: boolean = false;
    exists: boolean = false;

    constructor(public modal: NgbActiveModal) {}

    ngOnInit(): void {
        this.editMode = this.notebook.id !== "";
        this.name = this.notebook.name;

        for (let k in this.notebook.tagColors) {
            let color = this.notebook.tagColors[k];
            if (!color) color = "";

            this.tagColors.push(new TagColor(k, color));
        }

        this.checkValid();
    }

    getTitle(): string {
        if (this.editMode) return "Edit notebook";
        return "New notebook";
    }

    onNameInput() {
        this.checkValid();
    }

    checkValid() {
        const name: string = this.name.trim();
        this.valid = name.length > 1 && name.length < 200;

        const other = this.notebooks.find(
            (n: Notebook) => name.toLowerCase() === n.name.trim().toLowerCase()
        );

        this.exists = other !== undefined && (!this.editMode || this.notebook.id !== other.id);
    }

    onAddTagColorClick() {
        this.tagColors.push({tag: "", color: "#6c757d"});
    }

    onRemoveTagColorClick(i: number) {
        this.tagColors.splice(i, 1);
    }

    onAcceptClick() {
        if (!this.valid || this.exists) return;

        const result = new Notebook();
        result.id = this.notebook.id;
        result.name = this.name.trim();

        const tagColors: {[tag: string]: string} = {};

        for (let t of this.tagColors) {
            if (t.color) tagColors[t.tag] = t.color;
        }

        result.tagColors = tagColors;
        this.modal.close(result);
    }
}
