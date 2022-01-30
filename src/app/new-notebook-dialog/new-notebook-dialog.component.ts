import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
    selector: "app-new-notebook-dialog",
    templateUrl: "./new-notebook-dialog.component.html",
    styleUrls: ["./new-notebook-dialog.component.css"]
})
export class NewNotebookDialogComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
    }

    onSubmit(form: NgForm) {
        if (!form.valid) return;
    }
}
