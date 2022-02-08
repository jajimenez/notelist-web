import { Component, Input, OnInit } from "@angular/core";

import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-select-notebook-dialog",
    templateUrl: "./select-notebook-dialog.component.html",
    styleUrls: ["./select-notebook-dialog.component.css"]
})
export class SelectNotebookDialogComponent implements OnInit {
    @Input() notebooks: Notebook[] = [];

    constructor() {}

    ngOnInit(): void {}
}
